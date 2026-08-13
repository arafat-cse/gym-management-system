<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerSchedule extends Model
{
    protected $fillable = [
        'trainer_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'max_sessions',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
        ];
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
