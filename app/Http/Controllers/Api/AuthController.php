<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Неверные учетные данные.'],
            ]);
        }

        // Удаляем все существующие токены (единственная сессия)
        $user->tokens()->delete();

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('group'),
        ]);
    }

    public function refresh(Request $request)
    {
        $user = $request->user();
        
        // Удаляем текущий токен
        $request->user()->currentAccessToken()->delete();
        
        // Создаем новый токен
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Выход выполнен']);
    }

    public function user(Request $request)
    {
        $user = $request->user()->load('group');
        
        $trainingStatus = null;
        if ($user->role === 'user') {
            $trainingStatus = [
                'suspended' => $user->training_suspended,
                'suspensionReason' => $user->getSuspensionReasonText(),
                'daysRemaining' => $user->getTrainingDaysRemaining(),
                'isActive' => $user->isTrainingActive(),
                'isExpired' => $user->isTrainingExpired(),
                'startedAt' => $user->created_at->format('d.m.Y'),
                'groupName' => $user->group->name,
            ];
        }

        return response()->json([
            'user' => $user,
            'trainingStatus' => $trainingStatus,
        ]);
    }
}
