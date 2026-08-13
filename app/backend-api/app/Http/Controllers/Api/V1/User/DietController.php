<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\DietProgressRequest;
use App\Models\DietPlan;
use Illuminate\Http\Request;

class DietController extends Controller
{
    public function availablePlans()
    {
        return DietPlan::where('status', 'active')->paginate(20);
    }

    public function currentDiet(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $memberDiet = $member->memberDiets()
            ->with(['dietPlan.meals'])
            ->where('status', 'active')
            ->latest('start_date')
            ->first();

        abort_if(! $memberDiet, 404, 'No active diet plan assigned.');

        return $memberDiet;
    }

    public function progress(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return $this->activeMemberDiet($member)->progress()->latest('date')->paginate(20);
    }

    public function updateProgress(DietProgressRequest $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $memberDiet = $this->activeMemberDiet($member);

        $progress = $memberDiet->progress()->create($request->validated());

        return response()->json($progress, 201);
    }

    private function activeMemberDiet($member)
    {
        $memberDiet = $member->memberDiets()->where('status', 'active')->latest('start_date')->first();

        abort_if(! $memberDiet, 422, 'No active diet plan assigned.');

        return $memberDiet;
    }
}
