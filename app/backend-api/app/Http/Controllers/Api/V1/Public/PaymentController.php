<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Public\PaymentRequest;
use App\Models\Coupon;
use App\Models\Discount;
use App\Models\MemberRegistration;
use App\Models\MembershipPlan;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(PaymentRequest $request, MemberRegistration $memberRegistration)
    {
        abort_if($memberRegistration->status !== 'pending', 422, 'This registration has already been processed.');

        $data = $request->validated();

        if ($request->hasFile('screenshot')) {
            $data['screenshot_path'] = $request->file('screenshot')->store('payment-proofs', 'public');
        }

        $coupon = null;
        $discountAmount = null;

        if (! empty($data['coupon_code'])) {
            $plan = MembershipPlan::findOrFail($data['membership_plan_id']);
            $coupon = Coupon::findValidForAmount($data['coupon_code'], (float) $plan->price);
            $discountAmount = $coupon->calculateDiscount((float) $plan->price);
        }

        $payment = DB::transaction(function () use ($data, $memberRegistration, $coupon, $discountAmount) {
            $payment = Payment::create([
                'member_registration_id' => $memberRegistration->id,
                'membership_plan_id' => $data['membership_plan_id'],
                'coupon_id' => $coupon?->id,
                'method' => $data['method'],
                'sender_number' => $data['sender_number'],
                'transaction_id' => $data['transaction_id'],
                'amount' => $data['amount'],
                'discount_amount' => $discountAmount,
                'screenshot_path' => $data['screenshot_path'] ?? null,
            ]);

            if ($coupon) {
                Discount::create([
                    'coupon_id' => $coupon->id,
                    'member_registration_id' => $memberRegistration->id,
                    'payment_id' => $payment->id,
                    'amount' => $discountAmount,
                    'used_at' => now(),
                ]);

                $coupon->increment('used_count');
            }

            return $payment;
        });

        return response()->json([
            'message' => 'Payment submitted. Awaiting approval.',
            'payment' => $payment,
        ], 201);
    }
}
