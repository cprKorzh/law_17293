<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function show($token)
    {
        $registrationToken = RegistrationToken::where('token', $token)->first();

        if (!$registrationToken || !$registrationToken->isValid()) {
            return Inertia::render('auth/registration-expired');
        }

        $userData = $registrationToken->user_data;
        
        // Если это токен смены пароля, получаем данные пользователя из БД
        if (isset($userData['action']) && $userData['action'] === 'password_reset') {
            $username = $userData['username'] ?? null;
            if (!$username) {
                return Inertia::render('auth/registration-expired');
            }
            
            $user = User::where('username', $username)->first();
            if (!$user) {
                return Inertia::render('auth/registration-expired');
            }
            
            return Inertia::render('auth/complete-registration', [
                'token' => $token,
                'user' => [
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'patronimic' => $user->patronimic,
                    'username' => $user->username,
                    'email' => $user->email,
                    'tel' => $user->tel,
                ],
            ]);
        }

        // Старый функционал для создания нового пользователя
        return Inertia::render('auth/complete-registration', [
            'token' => $token,
            'userData' => $userData,
        ]);
    }

    public function store(Request $request, $token)
    {
        $registrationToken = RegistrationToken::where('token', $token)->first();

        if (!$registrationToken || !$registrationToken->isValid()) {
            return redirect()->route('login')->with('error', 'Ссылка недействительна или истекла');
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $userData = $registrationToken->user_data;

        // Если это токен смены пароля
        if (isset($userData['action']) && $userData['action'] === 'password_reset') {
            $username = $userData['username'] ?? null;
            if (!$username) {
                return redirect()->route('login')->with('error', 'Токен поврежден');
            }
            
            $user = User::where('username', $username)->first();
            if (!$user) {
                return redirect()->route('login')->with('error', 'Пользователь не найден');
            }

            // Обновляем пароль и отмечаем активацию через ссылку
            $user->update([
                'password' => Hash::make($request->password),
                'password_set_at' => now(), // Отмечаем активацию через ссылку
            ]);

            $registrationToken->markAsUsed();
            auth()->login($user);

            return redirect()->route('dashboard')->with('success', 'Пароль установлен, добро пожаловать!');
        }

        // Старый функционал для создания нового пользователя
        $userData['password'] = Hash::make($request->password);
        $user = User::create($userData);
        $registrationToken->markAsUsed();
        auth()->login($user);

        return redirect()->route('dashboard')->with('success', 'Регистрация завершена');
    }
}
