<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DietPlan extends Model
{
    protected $fillable = ['name', 'description', 'duration_in_days', 'type', 'calories', 'status'];

    public function meals(): HasMany
    {
        return $this->hasMany(DietMeal::class);
    }

    public function memberDiets(): HasMany
    {
        return $this->hasMany(MemberDiet::class);
    }
}
