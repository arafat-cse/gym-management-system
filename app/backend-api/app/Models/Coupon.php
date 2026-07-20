<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\ValidationException;

class Coupon extends Model
{
    protected $fillable = ['code', 'type', 'discount', 'min_order', 'max_uses', 'used_count', 'expires_at', 'status'];

    protected function casts(): array
    {
        return [
            'discount' => 'decimal:2',
            'min_order' => 'decimal:2',
            'expires_at' => 'date',
        ];
    }

    public function discounts(): HasMany
    {
        return $this->hasMany(Discount::class);
    }

    public static function findValidForAmount(string $code, float $amount): self
    {
        $coupon = self::where('code', $code)->first();

        if (! $coupon || $coupon->status !== 'active') {
            throw ValidationException::withMessages(['coupon_code' => ['Invalid or inactive coupon code.']]);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            throw ValidationException::withMessages(['coupon_code' => ['This coupon has expired.']]);
        }

        if ($coupon->max_uses !== null && $coupon->used_count >= $coupon->max_uses) {
            throw ValidationException::withMessages(['coupon_code' => ['This coupon has reached its usage limit.']]);
        }

        if ($coupon->min_order !== null && $amount < (float) $coupon->min_order) {
            throw ValidationException::withMessages(['coupon_code' => ["This coupon requires a minimum order of {$coupon->min_order}."]]);
        }

        return $coupon;
    }

    public function calculateDiscount(float $amount): float
    {
        $discount = $this->type === 'percentage'
            ? $amount * ((float) $this->discount / 100)
            : (float) $this->discount;

        return round(min($discount, $amount), 2);
    }
}
