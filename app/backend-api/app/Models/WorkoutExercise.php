<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutExercise extends Model
{
    protected $fillable = ['member_workout_id', 'exercise_id', 'sets', 'reps', 'weight'];

    public function memberWorkout(): BelongsTo
    {
        return $this->belongsTo(MemberWorkout::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
