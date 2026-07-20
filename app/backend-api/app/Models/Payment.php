<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Payment extends Model
{
    protected $fillable = [
        'member_registration_id',
        'membership_plan_id',
        'coupon_id',
        'method',
        'sender_number',
        'transaction_id',
        'amount',
        'discount_amount',
        'screenshot_path',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
    ];

    protected $appends = ['screenshot_url'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    public function getScreenshotUrlAttribute(): ?string
    {
        return $this->screenshot_path ? Storage::disk('public')->url($this->screenshot_path) : null;
    }

    public function memberRegistration(): BelongsTo
    {
        return $this->belongsTo(MemberRegistration::class);
    }

    public function membershipPlan(): BelongsTo
    {
        return $this->belongsTo(MembershipPlan::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
