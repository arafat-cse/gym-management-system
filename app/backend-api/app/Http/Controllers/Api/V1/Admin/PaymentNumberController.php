<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\PaymentNumberRequest;
use App\Models\PaymentNumber;

class PaymentNumberController extends Controller
{
    public function index()
    {
        return PaymentNumber::query()->paginate(20);
    }

    public function store(PaymentNumberRequest $request)
    {
        $paymentNumber = PaymentNumber::create($request->validated());

        return response()->json($paymentNumber, 201);
    }

    public function show(PaymentNumber $paymentNumber)
    {
        return $paymentNumber;
    }

    public function update(PaymentNumberRequest $request, PaymentNumber $paymentNumber)
    {
        $paymentNumber->update($request->validated());

        return $paymentNumber;
    }

    public function destroy(PaymentNumber $paymentNumber)
    {
        $paymentNumber->delete();

        return response()->json(null, 204);
    }
}
