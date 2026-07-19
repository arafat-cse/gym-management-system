<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\SubscriptionRequest;
use App\Models\MembershipPlan;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        return Subscription::with(['member.user', 'membershipPlan'])
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);
    }

    public function store(SubscriptionRequest $request)
    {
        $data = $request->validated();
        $plan = MembershipPlan::findOrFail($data['membership_plan_id']);

        $startDate = $data['start_date'] ?? now()->toDateString();

        $subscription = Subscription::create([
            'member_id' => $data['member_id'],
            'membership_plan_id' => $plan->id,
            'price_paid' => $data['price_paid'] ?? $plan->price,
            'start_date' => $startDate,
            'end_date' => now()->parse($startDate)->addDays($plan->duration_in_days),
            'status' => $data['status'] ?? 'active',
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json($subscription->load(['member.user', 'membershipPlan']), 201);
    }

    public function show(Subscription $subscription)
    {
        return $subscription->load(['member.user', 'membershipPlan']);
    }

    public function update(SubscriptionRequest $request, Subscription $subscription)
    {
        $subscription->update($request->validated());

        return $subscription->fresh(['member.user', 'membershipPlan']);
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return response()->json(null, 204);
    }
}
