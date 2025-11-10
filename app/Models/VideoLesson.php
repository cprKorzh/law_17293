<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoLesson extends Model
{
    protected $fillable = [
        'playlist_id',
        'title',
        'description',
        'lesson_date',
        'order_index',
        'kinescope_video_id',
        'is_active',
    ];

    protected $casts = [
        'lesson_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function playlist(): BelongsTo
    {
        return $this->belongsTo(Playlist::class);
    }

    public function kinescopeVideo(): BelongsTo
    {
        return $this->belongsTo(KinescopeVideo::class, 'kinescope_video_id', 'id');
    }
}
