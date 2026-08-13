<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        return Payment::with(['memberRegistration', 'membershipPlan'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['memberRegistration', 'membershipPlan', 'approvedBy']);
    }

    public function approve(Request $request, Payment $payment)
    {
        if (!in_array($payment->status, ['pending', 'rejected'])) {
            throw ValidationException::withMessages([
                'status' => ['This payment is already approved.'],
            ]);
        }

        $subscription = DB::transaction(function () use ($payment, $request) {
            $registration = $payment->memberRegistration;

            $member = in_array($registration->status, ['pending', 'rejected'])
                ? $registration->approveIntoMember($request->user()->id)
                : $registration->member;

            $plan = $payment->membershipPlan;

            $subscription = Subscription::create([
                'member_id' => $member->id,
                'membership_plan_id' => $plan->id,
                'price_paid' => $payment->amount,
                'start_date' => now(),
                'end_date' => now()->addDays($plan->duration_in_days),
                'status' => 'active',
            ]);

            $payment->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            return $subscription;
        });

        return $subscription->load(['member.user', 'membershipPlan']);
    }

    public function reject(Request $request, Payment $payment)
    {
        if ($payment->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['This payment has already been processed.'],
            ]);
        }

        $data = $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $payment->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return $payment;
    }
}
