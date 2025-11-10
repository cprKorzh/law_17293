<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KinescopeVideo extends Model
{
    protected $fillable = ['id', 'title', 'folder_id', 'duration', 'status'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function folder(): BelongsTo
    {
        return $this->belongsTo(KinescopeFolder::class, 'folder_id');
    }

    public function getEmbedUrlAttribute(): string
    {
        return "https://kinescope.io/embed/{$this->id}";
    }
}
