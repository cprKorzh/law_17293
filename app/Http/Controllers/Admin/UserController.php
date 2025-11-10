<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\RegistrationToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('group')->get([
            'id', 'name', 'surname', 'patronimic', 'username', 
            'email', 'tel', 'role', 'group_id', 'training_suspended', 'suspension_reason', 'password_set_at', 'created_at'
        ]);

        // Добавляем информацию о pending токенах
        $users->each(function ($user) {
            $pendingToken = RegistrationToken::where('user_data->username', $user->username)
                ->where('used', false)
                ->where('expires_at', '>', now())
                ->first();

            // Определяем статус пользователя по новой логике
            $isActivated = !!$user->password_set_at; // Активирован = установил пароль по ссылке
            $hasExpiredToken = RegistrationToken::where('user_data->username', $user->username)
                ->where('used', false)
                ->where('expires_at', '<=', now())
                ->exists();
            
            $needsActivation = !$isActivated && !$pendingToken && !$hasExpiredToken; // Неактивированный
            $isInactive = !$isActivated && !$pendingToken && $hasExpiredToken; // Неактивный (истекла ссылка)

            $user->pendingToken = $pendingToken ? [
                'id' => $pendingToken->id,
                'expires_at' => $pendingToken->expires_at->format('d.m.Y H:i'),
                'url' => url("/register/{$pendingToken->token}"),
            ] : null;

            $user->needsActivation = $needsActivation;
            $user->isActivated = $isActivated;
            $user->isInactive = $isInactive;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'groups' => Group::all(['id', 'name'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'groups' => Group::all(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'patronimic' => 'nullable|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'nullable|email|max:255|unique:users',
            'tel' => 'required|string|max:20|unique:users',
            'role' => 'required|in:admin,user',
            'group_id' => 'required|exists:groups,id',
            'created_at' => 'required|date',
        ]);

        // Создаем пользователя с временным паролем
        $user = new User([
            'name' => $request->name,
            'surname' => $request->surname,
            'patronimic' => $request->patronimic,
            'username' => $request->username,
            'email' => $request->email,
            'tel' => preg_replace('/\s+/', '', $request->tel), // Убираем пробелы
            'password' => Hash::make(Str::random(32)), // Временный пароль
            'role' => $request->role,
            'group_id' => $request->group_id,
            'training_suspended' => false,
            'suspension_reason' => null,
            'email_verified_at' => null, // Помечаем как неактивированного
        ]);
        
        $user->created_at = $request->created_at;
        $user->updated_at = now();
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Пользователь создан. Создайте ссылку для активации.');
    }

    public function show(User $user)
    {
        $pendingToken = RegistrationToken::where('user_data->username', $user->username)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load('group'),
            'pendingToken' => $pendingToken ? [
                'id' => $pendingToken->id,
                'expires_at' => $pendingToken->expires_at->format('d.m.Y H:i'),
                'url' => url("/register/{$pendingToken->token}"),
            ] : null,
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('group'),
            'groups' => Group::all(['id', 'name'])
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'patronimic' => 'nullable|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'tel' => 'required|string|max:20|unique:users,tel,' . $user->id,
            'role' => 'required|in:admin,user',
            'group_id' => 'required|exists:groups,id',
            'created_at' => 'required|date',
        ]);

        $user->fill($request->only([
            'name', 'surname', 'patronimic', 'username', 
            'email', 'role', 'group_id', 'training_suspended'
        ]));
        
        $user->tel = preg_replace('/\s+/', '', $request->tel); // Убираем пробелы
        $user->created_at = $request->created_at;
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Пользователь обновлен');
    }

    public function destroy(User $user)
    {
        RegistrationToken::revokeForUsername($user->username);
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Пользователь удален');
    }

    public function massDelete(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        // Исключаем текущего пользователя из списка удаления
        $userIds = array_filter($request->user_ids, function($id) {
            return $id != auth()->id();
        });

        $users = User::whereIn('id', $userIds)->get();
        
        foreach ($users as $user) {
            RegistrationToken::revokeForUsername($user->username);
        }
        
        User::whereIn('id', $userIds)->delete();

        return redirect()->route('admin.users.index')->with('success', 'Пользователи удалены');
    }

    public function toggleTraining(Request $request, User $user)
    {
        $request->validate([
            'training_suspended' => 'required|boolean',
            'suspension_reason' => 'nullable|in:theory_completed,user_request,expired',
        ]);

        $user->training_suspended = $request->training_suspended;
        $user->suspension_reason = $request->training_suspended ? $request->suspension_reason : null;

        // При возобновлении обучения обновляем дату начала
        if (!$request->training_suspended && $user->getOriginal('training_suspended')) {
            $user->created_at = now();
        }

        $user->save();

        $status = $request->training_suspended ? 'приостановлено' : 'возобновлено';
        return redirect()->route('admin.users.index')->with('success', "Обучение {$status}");
    }

    public function showRegistrationLink(RegistrationToken $token)
    {
        if (!$token->isValid()) {
            return redirect()->route('admin.users.index')->with('error', 'Токен недействителен');
        }

        $registrationUrl = url("/register/{$token->token}");
        
        return Inertia::render('Admin/Users/RegistrationLink', [
            'registrationUrl' => $registrationUrl,
            'userData' => $token->user_data,
            'expiresAt' => $token->expires_at->format('d.m.Y H:i'),
        ]);
    }

    public function reissueRegistrationLink(User $user)
    {
        // Отзываем старые токены
        RegistrationToken::revokeForUsername($user->username);

        // Создаем токен только с минимальной информацией
        $userData = [
            'username' => $user->username, // Только username для связи
            'action' => 'password_reset',
        ];

        $token = RegistrationToken::generate($userData);

        return redirect()->route('admin.users.show-registration-link', $token->id);
    }

    public function export()
    {
        $users = User::with('group')->get();
        
        $filename = 'users_export_' . now()->format('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            
            // Добавляем BOM для UTF-8
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Заголовки
            fputcsv($file, [
                'name', 'surname', 'patronimic', 'username', 'email', 
                'tel', 'role', 'group_name', 'training_suspended', 
                'suspension_reason', 'created_at'
            ]);
            
            // Данные
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->name ?? '',
                    $user->surname ?? '',
                    $user->patronimic ?? '',
                    $user->username,
                    $user->email ?? '',
                    $user->tel,
                    $user->role,
                    $user->group->name ?? '',
                    $user->training_suspended ? 'true' : 'false',
                    $user->suspension_reason ?? '',
                    $user->created_at->format('Y-m-d H:i:s'),
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $csvData = array_map('str_getcsv', file($file->getRealPath()));
        
        // Удаляем BOM если есть
        if (!empty($csvData[0][0]) && substr($csvData[0][0], 0, 3) === "\xEF\xBB\xBF") {
            $csvData[0][0] = substr($csvData[0][0], 3);
        }
        
        $header = array_shift($csvData);
        $imported = 0;
        $errors = [];

        foreach ($csvData as $index => $row) {
            try {
                $data = array_combine($header, $row);
                
                // Находим группу по имени
                $group = Group::where('name', $data['group_name'])->first();
                if (!$group) {
                    $errors[] = "Строка " . ($index + 2) . ": Группа '{$data['group_name']}' не найдена";
                    continue;
                }

                // Проверяем уникальность username
                if (User::where('username', $data['username'])->exists()) {
                    $errors[] = "Строка " . ($index + 2) . ": Данный логин уже занят";
                    continue;
                }

                // Проверяем уникальность email (если указан)
                if (!empty($data['email']) && User::where('email', $data['email'])->exists()) {
                    $errors[] = "Строка " . ($index + 2) . ": Данная почта уже используется";
                    continue;
                }

                // Проверяем уникальность телефона
                $cleanTel = preg_replace('/\s+/', '', $data['tel']);
                if (User::where('tel', $cleanTel)->exists()) {
                    $errors[] = "Строка " . ($index + 2) . ": Данный телефон уже используется";
                    continue;
                }

                User::create([
                    'name' => $data['name'] ?: null,
                    'surname' => $data['surname'] ?: null,
                    'patronimic' => $data['patronimic'] ?: null,
                    'username' => $data['username'],
                    'email' => $data['email'] ?: null,
                    'tel' => $cleanTel, // Используем очищенный телефон
                    'password' => Hash::make(Str::random(32)),
                    'role' => $data['role'],
                    'group_id' => $group->id,
                    'training_suspended' => $data['training_suspended'] === 'true',
                    'suspension_reason' => $data['suspension_reason'] ?: null,
                    'created_at' => $data['created_at'] ? \Carbon\Carbon::parse($data['created_at']) : now(),
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Строка " . ($index + 2) . ": " . $e->getMessage();
            }
        }

        $message = "Импортировано пользователей: {$imported}";
        if (!empty($errors)) {
            $message .= ". Ошибки: " . implode('; ', array_slice($errors, 0, 3));
            if (count($errors) > 3) {
                $message .= " и еще " . (count($errors) - 3) . " ошибок";
            }
        }

        return redirect()->route('admin.users.index')->with('success', $message);
    }
}
