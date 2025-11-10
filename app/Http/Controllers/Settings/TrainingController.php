<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $user->load('group');

        $trainingStatus = [
            'suspended' => $user->training_suspended,
            'suspensionReason' => $user->getSuspensionReasonText(),
            'daysRemaining' => $user->getTrainingDaysRemaining(),
            'isActive' => $user->isTrainingActive(),
            'isExpired' => $user->isTrainingExpired(),
            'startedAt' => $user->created_at->format('d.m.Y'),
            'groupName' => $user->group->name,
        ];

        return Inertia::render('settings/training', [
            'trainingStatus' => $trainingStatus
        ]);
    }
}
