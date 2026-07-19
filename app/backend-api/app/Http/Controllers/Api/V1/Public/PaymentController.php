<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Public\PaymentRequest;
use App\Models\MemberRegistration;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function store(PaymentRequest $request, MemberRegistration $memberRegistration)
    {
        abort_if($memberRegistration->status !== 'pending', 422, 'This registration has already been processed.');

        $data = $request->validated();

        if ($request->hasFile('screenshot')) {
            $data['screenshot_path'] = $request->file('screenshot')->store('payment-proofs', 'public');
        }

        $payment = Payment::create([
            'member_registration_id' => $memberRegistration->id,
            'membership_plan_id' => $data['membership_plan_id'],
            'method' => $data['method'],
            'sender_number' => $data['sender_number'],
            'transaction_id' => $data['transaction_id'],
            'amount' => $data['amount'],
            'screenshot_path' => $data['screenshot_path'] ?? null,
        ]);

        return response()->json([
            'message' => 'Payment submitted. Awaiting approval.',
            'payment' => $payment,
        ], 201);
    }
}
