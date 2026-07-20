<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberLocker extends Model
{
    protected $fillable = ['member_id', 'locker_id', 'assigned_at', 'status'];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
        ];
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function locker(): BelongsTo
    {
        return $this->belongsTo(Locker::class);
    }
}
