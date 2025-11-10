<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KinescopeFolder;
use App\Models\KinescopeProject;
use App\Models\KinescopeVideo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class VideoController extends Controller
{
    private $kinescopeToken;
    private $kinescopeApiUrl = 'https://api.kinescope.io/v1';

    public function __construct()
    {
        $this->kinescopeToken = config('services.kinescope.token');
    }

    private function loadVideosForFolder($folderId)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->kinescopeToken,
            'Accept' => 'application/json',
        ])->get($this->kinescopeApiUrl . '/videos', [
            'folder_id' => $folderId,
            'per_page' => 100,
        ]);

        return $response->successful() ? $response->json()['data'] ?? [] : [];
    }

    private function loadSubfolders($projectId, $parentFolder)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->kinescopeToken,
            'Accept' => 'application/json',
        ])->get($this->kinescopeApiUrl . "/projects/{$projectId}/folders", [
            'per_page' => 100,
        ]);

        if (!$response->successful()) {
            return [];
        }

        $allFolders = $response->json()['data'] ?? [];

        $children = array_filter($allFolders, function($folder) use ($parentFolder) {
            return $folder['parent_id'] === $parentFolder['id'];
        });

        foreach ($children as &$child) {
            $child['children'] = $this->loadSubfolders($projectId, $child);
            if (empty($child['children'])) {
                $child['videos'] = $this->loadVideosForFolder($child['id']);
            }
        }

        return array_values($children);
    }

    public function index()
    {
        $projects = KinescopeProject::all();

        $foldersByProject = $projects->map(function($project) {
            // Корневые папки - где parent_id = project_id
            $rootFolders = KinescopeFolder::where('project_id', $project->id)
                ->where('parent_id', $project->id)
                ->get();

            return [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                ],
                'folders' => $this->buildFolderTree($rootFolders),
            ];
        })->toArray();

        return Inertia::render('Admin/Videos/Index', [
            'foldersByProject' => $foldersByProject,
        ]);
    }

    private function buildFolderTree($folders)
    {
        return $folders->map(function($folder) {
            $children = KinescopeFolder::where('parent_id', $folder->id)->get();
            $videos = KinescopeVideo::where('folder_id', $folder->id)->get();

            return [
                'id' => $folder->id,
                'name' => $folder->name,
                'project_id' => $folder->project_id,
                'parent_id' => $folder->parent_id,
                'children' => $children->isNotEmpty() ? $this->buildFolderTree($children) : [],
                'videos' => $videos->map(fn($v) => [
                    'id' => $v->id,
                    'title' => $v->title,
                    'duration' => $v->duration,
                    'status' => $v->status,
                ])->toArray(),
            ];
        })->toArray();
    }

    public function sync()
    {
        try {
            DB::beginTransaction();

            $projectsResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->kinescopeToken,
                'Accept' => 'application/json',
            ])->get($this->kinescopeApiUrl . '/projects', [
                'per_page' => 100,
            ]);

            $projects = $projectsResponse->successful() ? $projectsResponse->json()['data'] ?? [] : [];

            foreach ($projects as $project) {
                KinescopeProject::updateOrCreate(
                    ['id' => $project['id']],
                    ['name' => $project['name']]
                );

                $rootFolders = $project['folders'] ?? [];

                foreach ($rootFolders as $folder) {
                    $this->syncFolderRecursive($project['id'], $folder);
                }
            }

            DB::commit();
            return redirect()->route('admin.videos.index')->with('success', 'Синхронизация завершена');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.videos.index')->with('error', 'Ошибка синхронизации: ' . $e->getMessage());
        }
    }

    private function syncFolderRecursive($projectId, $folderData)
    {
        KinescopeFolder::updateOrCreate(
            ['id' => $folderData['id']],
            [
                'name' => $folderData['name'],
                'project_id' => $projectId,
                'parent_id' => $folderData['parent_id'] ?? null,
            ]
        );

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->kinescopeToken,
            'Accept' => 'application/json',
        ])->get($this->kinescopeApiUrl . "/projects/{$projectId}/folders", [
            'per_page' => 100,
        ]);

        if ($response->successful()) {
            $allFolders = $response->json()['data'] ?? [];

            $children = array_filter($allFolders, function($folder) use ($folderData) {
                return $folder['parent_id'] === $folderData['id'];
            });

            if (empty($children)) {
                $videos = $this->loadVideosForFolder($folderData['id']);

                foreach ($videos as $video) {
                    KinescopeVideo::updateOrCreate(
                        ['id' => $video['id']],
                        [
                            'title' => $video['title'],
                            'folder_id' => $folderData['id'],
                            'duration' => $video['duration'] ?? null,
                            'status' => $video['status'] ?? null,
                        ]
                    );
                }
            } else {
                foreach ($children as $child) {
                    $this->syncFolderRecursive($projectId, $child);
                }
            }
        }
    }
}
