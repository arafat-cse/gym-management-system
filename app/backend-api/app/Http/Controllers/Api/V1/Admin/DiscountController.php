<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index(Request $request)
    {
        return Discount::with(['coupon', 'memberRegistration'])
            ->when($request->query('coupon_id'), fn ($q, $couponId) => $q->where('coupon_id', $couponId))
            ->latest('used_at')
            ->paginate(20);
    }
}
