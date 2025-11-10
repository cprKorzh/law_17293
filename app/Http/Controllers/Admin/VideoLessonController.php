<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\KinescopeVideo;
use App\Models\VideoLesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoLessonController extends Controller
{
    public function index()
    {
        $videoLessons = VideoLesson::with(['kinescopeVideo', 'groups'])
            ->orderBy('order_index')
            ->orderBy('lesson_date')
            ->get();

        return Inertia::render('admin/video-lessons/index', [
            'videoLessons' => $videoLessons,
        ]);
    }

    public function create()
    {
        $kinescopeVideos = KinescopeVideo::all();
        $groups = Group::all();

        return Inertia::render('admin/video-lessons/create', [
            'kinescopeVideos' => $kinescopeVideos,
            'groups' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lesson_date' => 'required|date',
            'order_index' => 'required|integer|min:0',
            'kinescope_video_id' => 'required|exists:kinescope_videos,id',
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'exists:groups,id',
        ]);

        $videoLesson = VideoLesson::create($validated);
        $videoLesson->groups()->sync($validated['group_ids']);

        return redirect()->route('admin.video-lessons.index');
    }

    public function edit(VideoLesson $videoLesson)
    {
        $videoLesson->load(['kinescopeVideo', 'groups']);
        $kinescopeVideos = KinescopeVideo::all();
        $groups = Group::all();

        return Inertia::render('admin/video-lessons/edit', [
            'videoLesson' => $videoLesson,
            'kinescopeVideos' => $kinescopeVideos,
            'groups' => $groups,
        ]);
    }

    public function update(Request $request, VideoLesson $videoLesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lesson_date' => 'required|date',
            'order_index' => 'required|integer|min:0',
            'kinescope_video_id' => 'required|exists:kinescope_videos,id',
            'group_ids' => 'required|array|min:1',
            'group_ids.*' => 'exists:groups,id',
            'is_active' => 'boolean',
        ]);

        $videoLesson->update($validated);
        $videoLesson->groups()->sync($validated['group_ids']);

        return redirect()->route('admin.video-lessons.index');
    }

    public function destroy(VideoLesson $videoLesson)
    {
        $videoLesson->delete();
        return redirect()->route('admin.video-lessons.index');
    }
}
