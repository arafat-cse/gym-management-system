<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerSpecialization extends Model
{
    protected $fillable = [
        'trainer_id',
        'specialization_name',
        'certification_level',
        'certification_date',
        'expiry_date',
        'issuing_authority',
    ];

    protected function casts(): array
    {
        return [
            'certification_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
