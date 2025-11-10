<?php

namespace App\Http\Controllers;

use App\Models\VideoLesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoLessonController extends Controller
{
    public function show(Request $request, VideoLesson $videoLesson)
    {
        $user = $request->user();
        
        // Проверяем доступ пользователя к видеоуроку через плейлист
        $playlist = $videoLesson->playlist;
        if (!$playlist->groups->contains('id', $user->group_id) || !$playlist->is_active) {
            abort(403);
        }

        $videoLesson->load(['kinescopeVideo', 'playlist']);

        return Inertia::render('video-lessons/show', [
            'videoLesson' => $videoLesson,
        ]);
    }
}
