<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\VideoLesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaylistController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $playlists = Playlist::with(['videoLessons.kinescopeVideo'])
            ->whereHas('groups', function ($query) use ($user) {
                $query->where('groups.id', $user->group_id);
            })
            ->where('is_active', true)
            ->get();

        return Inertia::render('playlists/index', [
            'playlists' => $playlists,
            'trainingSuspended' => $user->role === 'user' ? $user->training_suspended : false,
            'suspensionReason' => $user->role === 'user' ? $user->getSuspensionReasonText() : null,
        ]);
    }

    public function show(Request $request, Playlist $playlist)
    {
        $user = $request->user();
        
        // Проверяем статус обучения для обычных пользователей
        if ($user->role === 'user' && $user->training_suspended) {
            return redirect()->route('playlists.index');
        }
        
        // Проверяем доступ пользователя к плейлисту
        if (!$playlist->groups->contains('id', $user->group_id) || !$playlist->is_active) {
            abort(403);
        }

        $playlist->load(['videoLessons.kinescopeVideo']);

        return Inertia::render('playlists/show', [
            'playlist' => $playlist,
        ]);
    }
}
