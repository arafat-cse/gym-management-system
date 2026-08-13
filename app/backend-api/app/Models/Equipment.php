<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    protected $fillable = ['name', 'type', 'branch_id', 'status', 'purchase_date', 'cost'];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'cost' => 'decimal:2',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(EquipmentMaintenance::class);
    }
}
