<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return Payment::whereHas('memberRegistration', fn ($q) => $q->where('member_id', $member->id))
            ->with('membershipPlan')
            ->latest()
            ->paginate(20);
    }

    public function show(Request $request, Payment $payment)
    {
        $member = $request->user()->member;

        abort_if(! $member || $payment->memberRegistration->member_id !== $member->id, 403);

        return $payment->load('membershipPlan');
    }
}
