<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Discount extends Model
{
    protected $fillable = ['coupon_id', 'member_registration_id', 'payment_id', 'amount', 'used_at'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'used_at' => 'datetime',
        ];
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function memberRegistration(): BelongsTo
    {
        return $this->belongsTo(MemberRegistration::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
