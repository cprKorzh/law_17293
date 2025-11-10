<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Playlist extends Model
{
    protected $fillable = [
        'title',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function videoLessons(): HasMany
    {
        return $this->hasMany(VideoLesson::class)->orderBy('order_index')->orderBy('lesson_date');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'playlist_groups');
    }
}
