<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberWorkout extends Model
{
    protected $fillable = [
        'member_id',
        'trainer_id',
        'date',
        'duration_minutes',
        'type',
        'intensity',
        'calories_burned',
        'status',
        'notes',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(WorkoutExercise::class);
    }
}
