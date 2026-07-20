<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthInfo extends Model
{
    protected $table = 'health_info';

    protected $fillable = [
        'member_id',
        'height',
        'weight',
        'bmi',
        'blood_type',
        'allergies',
        'conditions',
        'medications',
        'emergency_contact',
    ];

    protected function casts(): array
    {
        return [
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
            'bmi' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (HealthInfo $healthInfo) {
            if ($healthInfo->height && $healthInfo->weight) {
                $heightInMeters = $healthInfo->height / 100;
                $healthInfo->bmi = round($healthInfo->weight / ($heightInMeters ** 2), 2);
            }
        });
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
