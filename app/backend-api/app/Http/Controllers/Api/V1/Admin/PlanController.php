<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\PlanRequest;
use App\Models\MembershipPlan;

class PlanController extends Controller
{
    public function index()
    {
        return MembershipPlan::query()->paginate(20);
    }

    public function store(PlanRequest $request)
    {
        $plan = MembershipPlan::create($request->validated());

        return response()->json($plan, 201);
    }

    public function show(MembershipPlan $plan)
    {
        return $plan;
    }

    public function update(PlanRequest $request, MembershipPlan $plan)
    {
        $plan->update($request->validated());

        return $plan;
    }

    public function destroy(MembershipPlan $plan)
    {
        $plan->delete();

        return response()->json(null, 204);
    }
}
