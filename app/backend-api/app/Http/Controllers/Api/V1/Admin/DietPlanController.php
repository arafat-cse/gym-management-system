<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\DietMealRequest;
use App\Http\Requests\Api\Admin\DietPlanRequest;
use App\Models\DietMeal;
use App\Models\DietPlan;

class DietPlanController extends Controller
{
    public function index()
    {
        return DietPlan::withCount('meals')->paginate(20);
    }

    public function store(DietPlanRequest $request)
    {
        $dietPlan = DietPlan::create($request->validated());

        return response()->json($dietPlan, 201);
    }

    public function show(DietPlan $dietPlan)
    {
        return $dietPlan->load('meals');
    }

    public function update(DietPlanRequest $request, DietPlan $dietPlan)
    {
        $dietPlan->update($request->validated());

        return $dietPlan->fresh();
    }

    public function destroy(DietPlan $dietPlan)
    {
        $dietPlan->delete();

        return response()->json(null, 204);
    }

    public function meals(DietPlan $dietPlan)
    {
        return $dietPlan->meals;
    }

    public function addMeal(DietMealRequest $request, DietPlan $dietPlan)
    {
        $meal = $dietPlan->meals()->create($request->validated());

        return response()->json($meal, 201);
    }

    public function removeMeal(DietPlan $dietPlan, DietMeal $meal)
    {
        abort_if($meal->diet_plan_id !== $dietPlan->id, 404);

        $meal->delete();

        return response()->json(null, 204);
    }
}
