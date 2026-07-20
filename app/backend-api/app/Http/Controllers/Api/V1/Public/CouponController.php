<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCode(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'membership_plan_id' => ['required', 'exists:membership_plans,id'],
        ]);

        $plan = MembershipPlan::findOrFail($data['membership_plan_id']);
        $coupon = Coupon::findValidForAmount($data['code'], (float) $plan->price);
        $discountAmount = $coupon->calculateDiscount((float) $plan->price);

        return [
            'coupon' => $coupon,
            'plan_price' => $plan->price,
            'discount_amount' => $discountAmount,
            'final_price' => round((float) $plan->price - $discountAmount, 2),
        ];
    }
}
