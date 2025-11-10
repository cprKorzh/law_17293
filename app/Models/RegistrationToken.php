<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RegistrationToken extends Model
{
    protected $fillable = [
        'token',
        'user_data',
        'expires_at',
        'used',
    ];

    protected $casts = [
        'user_data' => 'array',
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    public static function generate(array $userData): self
    {
        return self::create([
            'token' => Str::random(64),
            'user_data' => $userData,
            'expires_at' => now()->addHours(24),
        ]);
    }

    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    public function markAsUsed(): void
    {
        $this->update(['used' => true]);
    }

    public function getUsername(): string
    {
        return $this->user_data['username'] ?? '';
    }

    public static function revokeForUsername(string $username): void
    {
        self::where('user_data->username', $username)->delete();
    }
}
