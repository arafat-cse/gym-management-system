<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\CouponRequest;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function index()
    {
        return Coupon::latest()->paginate(20);
    }

    public function store(CouponRequest $request)
    {
        $coupon = Coupon::create($request->validated());

        return response()->json($coupon, 201);
    }

    public function show(Coupon $coupon)
    {
        return $coupon;
    }

    public function update(CouponRequest $request, Coupon $coupon)
    {
        $coupon->update($request->validated());

        return $coupon->fresh();
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return response()->json(null, 204);
    }
}
