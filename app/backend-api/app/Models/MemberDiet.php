<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberDiet extends Model
{
    protected $fillable = ['member_id', 'diet_plan_id', 'start_date', 'end_date', 'status'];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function dietPlan(): BelongsTo
    {
        return $this->belongsTo(DietPlan::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(DietProgress::class);
    }
}
