<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KinescopeProject extends Model
{
    protected $fillable = ['id', 'name'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function folders(): HasMany
    {
        return $this->hasMany(KinescopeFolder::class, 'project_id');
    }
}
