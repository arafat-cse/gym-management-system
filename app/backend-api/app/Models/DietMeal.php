<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DietMeal extends Model
{
    protected $fillable = ['diet_plan_id', 'meal_type', 'name', 'calories', 'protein', 'carbs', 'fats'];

    public function dietPlan(): BelongsTo
    {
        return $this->belongsTo(DietPlan::class);
    }
}
