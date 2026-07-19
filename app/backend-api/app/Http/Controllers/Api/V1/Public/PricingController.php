<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlan;

class PricingController extends Controller
{
    public function index()
    {
        return MembershipPlan::query()
            ->where('status', 'active')
            ->get();
    }
}
