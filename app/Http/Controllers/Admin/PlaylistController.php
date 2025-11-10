<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\KinescopeVideo;
use App\Models\Playlist;
use App\Models\VideoLesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaylistController extends Controller
{
    public function index()
    {
        $playlists = Playlist::with(['groups', 'videoLessons'])
            ->withCount('videoLessons')
            ->get();

        return Inertia::render('Admin/Playlists/Index', [
            'playlists' => $playlists,
        ]);
    }

    public function create()
    {
        $groups = Group::all();
        
        // Получаем структуру папок из базы данных (как в VideoController)
        $projects = \App\Models\KinescopeProject::all();

        $foldersByProject = $projects->map(function($project) {
            // Корневые папки - где parent_id = project_id
            $rootFolders = \App\Models\KinescopeFolder::where('project_id', $project->id)
                ->where('parent_id', $project->id)
                ->get();
            
            return [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                ],
                'folders' => $this->buildFolderTree($rootFolders),
            ];
        });

        return Inertia::render('Admin/Playlists/Create', [
            'groups' => $groups,
            'foldersByProject' => $foldersByProject,
        ]);
    }

    private function buildFolderTree($folders)
    {
        return $folders->map(function($folder) {
            $children = \App\Models\KinescopeFolder::where('parent_id', $folder->id)->get();
            $videos = \App\Models\KinescopeVideo::where('folder_id', $folder->id)->get();
            
            return [
                'id' => $folder->id,
                'name' => $folder->name,
                'children' => $children->isNotEmpty() ? $this->buildFolderTree($children) : [],
                'videos' => $videos->map(fn($v) => [
                    'id' => $v->id,
                    'title' => $v->title,
                ])->toArray(),
            ];
        })->toArray();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'exists:groups,id',
            'video_lessons' => 'required|array|min:1',
            'video_lessons.*.title' => 'required|string|max:255',
            'video_lessons.*.description' => 'nullable|string',
            'video_lessons.*.lesson_date' => 'required|date',
            'video_lessons.*.order_index' => 'required|integer|min:0',
            'video_lessons.*.kinescope_video_id' => 'required|exists:kinescope_videos,id',
        ]);

        $playlist = Playlist::create($validated);
        $playlist->groups()->sync($validated['group_ids']);

        foreach ($validated['video_lessons'] as $lessonData) {
            $playlist->videoLessons()->create($lessonData);
        }

        return redirect()->route('admin.playlists.index');
    }

    public function show(Playlist $playlist)
    {
        $playlist->load(['groups', 'videoLessons.kinescopeVideo']);

        return Inertia::render('Admin/Playlists/Show', [
            'playlist' => $playlist,
        ]);
    }

    public function edit(Playlist $playlist)
    {
        $playlist->load(['groups', 'videoLessons.kinescopeVideo']);
        $groups = Group::all();
        
        // Получаем структуру папок из базы данных (как в VideoController)
        $projects = \App\Models\KinescopeProject::all();

        $foldersByProject = $projects->map(function($project) {
            // Корневые папки - где parent_id = project_id
            $rootFolders = \App\Models\KinescopeFolder::where('project_id', $project->id)
                ->where('parent_id', $project->id)
                ->get();
            
            return [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                ],
                'folders' => $this->buildFolderTree($rootFolders),
            ];
        });

        return Inertia::render('Admin/Playlists/Edit', [
            'playlist' => $playlist,
            'groups' => $groups,
            'foldersByProject' => $foldersByProject,
        ]);
    }

    public function update(Request $request, Playlist $playlist)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'exists:groups,id',
            'video_lessons' => 'required|array|min:1',
            'video_lessons.*.id' => 'nullable|exists:video_lessons,id',
            'video_lessons.*.title' => 'required|string|max:255',
            'video_lessons.*.description' => 'nullable|string',
            'video_lessons.*.lesson_date' => 'required|date',
            'video_lessons.*.order_index' => 'required|integer|min:0',
            'video_lessons.*.kinescope_video_id' => 'required|exists:kinescope_videos,id',
        ]);

        $playlist->update($validated);
        $playlist->groups()->sync($validated['group_ids']);

        // Удаляем старые уроки
        $playlist->videoLessons()->delete();

        // Создаем новые уроки
        foreach ($validated['video_lessons'] as $lessonData) {
            unset($lessonData['id']); // Убираем ID для создания новых записей
            $playlist->videoLessons()->create($lessonData);
        }

        return redirect()->route('admin.playlists.index');
    }

    public function destroy(Playlist $playlist)
    {
        $playlist->delete();
        return redirect()->route('admin.playlists.index');
    }
}
