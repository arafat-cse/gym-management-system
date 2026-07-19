<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = ['name', 'address', 'phone', 'status'];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }
}
