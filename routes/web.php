<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\RegistrationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('/register/{token}', [RegistrationController::class, 'show'])->name('register.show');
Route::post('/register/{token}', [RegistrationController::class, 'store'])->name('register.store');

Route::middleware(['auth', 'verified', 'single.session'])->group(function () {
    Route::get('dashboard', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Для администраторов - перенаправляем в админ панель
        if ($user->role === 'admin') {
            return redirect()->route('admin.users.index');
        }

        // Для пользователей - перенаправляем к плейлистам
        return redirect()->route('playlists.index');
    })->name('dashboard');

    // Плейлисты для пользователей
    Route::get('playlists', [\App\Http\Controllers\PlaylistController::class, 'index'])->name('playlists.index');
    Route::get('playlists/{playlist}', [\App\Http\Controllers\PlaylistController::class, 'show'])->name('playlists.show');
    Route::get('video-lessons/{videoLesson}', [\App\Http\Controllers\VideoLessonController::class, 'show'])->name('video-lessons.show');
});

// comander panel
Route::middleware(['auth', 'verified', 'admin', 'single.session'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class);
    Route::post('users/mass-delete', [UserController::class, 'massDelete'])->name('users.mass-delete');
    Route::patch('users/{user}/toggle-training', [UserController::class, 'toggleTraining'])->name('users.toggle-training');
    Route::get('users/registration-link/{token}', [UserController::class, 'showRegistrationLink'])->name('users.show-registration-link');
    Route::post('users/{user}/reissue-registration-link', [UserController::class, 'reissueRegistrationLink'])->name('users.reissue-registration-link');
    Route::get('users-export', [UserController::class, 'export'])->name('users.export');
    Route::post('users-import', [UserController::class, 'import'])->name('users.import');

    Route::resource('groups', \App\Http\Controllers\Admin\GroupController::class);
    Route::resource('playlists', \App\Http\Controllers\Admin\PlaylistController::class);
    Route::get('videos', [\App\Http\Controllers\Admin\VideoController::class, 'index'])->name('videos.index');
    Route::post('videos/sync', [\App\Http\Controllers\Admin\VideoController::class, 'sync'])->name('videos.sync');
});

// // ВРЕМЕННЫЙ маршрут для предпросмотра email (удалить в продакшене)
// Route::get('/mail-preview', function () {
//     $user = \App\Models\User::first();

//     // Создаем уведомление для предпросмотра
//     $notification = new \Illuminate\Auth\Notifications\ResetPassword('preview-token-123');

//     // Возвращаем как mailable для предпросмотра
//     return $notification->toMail($user);
// });

require __DIR__.'/settings.php';
