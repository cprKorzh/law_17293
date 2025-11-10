<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surname',
        'patronimic',
        'username',
        'email',
        'tel',
        'password',
        'password_set_at',
        'role',
        'group_id',
        'training_suspended',
        'suspension_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_set_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function getTrainingDaysRemaining(): int
    {
        if ($this->training_suspended) {
            return 0;
        }
        
        $trainingStartDate = $this->created_at;
        $trainingEndDate = $trainingStartDate->addDays(92);
        $daysRemaining = now()->diffInDays($trainingEndDate, false);
        
        // Автоматически приостанавливаем обучение при истечении срока
        if ($daysRemaining <= 0 && !$this->training_suspended) {
            $this->update([
                'training_suspended' => true,
                'suspension_reason' => 'expired'
            ]);
            return 0;
        }
        
        return max(0, (int) $daysRemaining);
    }

    public function isTrainingActive(): bool
    {
        return !$this->training_suspended && $this->getTrainingDaysRemaining() > 0;
    }

    public function isTrainingExpired(): bool
    {
        return !$this->training_suspended && $this->getTrainingDaysRemaining() <= 0;
    }

    public function getSuspensionReasonText(): ?string
    {
        if (!$this->training_suspended || !$this->suspension_reason) {
            return null;
        }

        return match($this->suspension_reason) {
            'theory_completed' => 'Обучение теории окончено',
            'user_request' => 'Приостановка обучения по инициативе пользователя',
            'expired' => 'Окончен срок обучения',
            default => null,
        };
    }
}
