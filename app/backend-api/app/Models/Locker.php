<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Locker extends Model
{
    protected $fillable = ['branch_id', 'number', 'size', 'status'];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function memberLocker(): HasOne
    {
        return $this->hasOne(MemberLocker::class);
    }
}
