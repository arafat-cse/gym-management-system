<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\PaymentNumber;

class PaymentNumberController extends Controller
{
    public function index()
    {
        return PaymentNumber::query()
            ->where('is_active', true)
            ->get(['id', 'method', 'number', 'label']);
    }
}
