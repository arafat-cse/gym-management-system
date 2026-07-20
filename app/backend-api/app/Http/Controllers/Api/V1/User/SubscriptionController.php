<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function current(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $subscription = $member->subscriptions()->with('membershipPlan')->latest('start_date')->first();

        return $subscription ?? response()->json(null, 404);
    }

    public function history(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return $member->subscriptions()->with('membershipPlan')->latest('start_date')->paginate(20);
    }
}
