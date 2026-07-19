<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingSession extends Model
{
    protected $fillable = [
        'trainer_id',
        'member_id',
        'branch_id',
        'session_date',
        'start_time',
        'end_time',
        'session_type',
        'status',
        'fee',
        'payment_status',
        'notes',
        'member_rating',
        'trainer_notes',
    ];

    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'fee' => 'decimal:2',
        ];
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
