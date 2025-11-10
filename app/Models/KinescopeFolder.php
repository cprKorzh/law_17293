<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KinescopeFolder extends Model
{
    protected $fillable = ['id', 'name', 'project_id', 'parent_id'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function project(): BelongsTo
    {
        return $this->belongsTo(KinescopeProject::class, 'project_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(KinescopeFolder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(KinescopeFolder::class, 'parent_id');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(KinescopeVideo::class, 'folder_id');
    }
}
