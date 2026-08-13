<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = ['name', 'address', 'phone', 'contact_details', 'operating_hours', 'status'];

    protected $casts = [
        'contact_details' => 'array',
        'operating_hours' => 'array',
    ];
    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }
}
