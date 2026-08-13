<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trainer extends Model
{
    protected $fillable = [
        'user_id',
        'branch_id',
        'employee_id',
        'specialization',
        'certifications',
        'experience_years',
        'hourly_rate',
        'session_rate',
        'bio',
        'rating_avg',
        'total_sessions',
        'status',
        'join_date',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'hourly_rate' => 'decimal:2',
            'session_rate' => 'decimal:2',
            'rating_avg' => 'decimal:2',
            'join_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function specializations(): HasMany
    {
        return $this->hasMany(TrainerSpecialization::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(TrainerSchedule::class);
    }

    public function trainingSessions(): HasMany
    {
        return $this->hasMany(TrainingSession::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
