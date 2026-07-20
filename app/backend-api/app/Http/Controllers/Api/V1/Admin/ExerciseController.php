<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\ExerciseRequest;
use App\Models\Exercise;

class ExerciseController extends Controller
{
    public function index()
    {
        return Exercise::paginate(20);
    }

    public function store(ExerciseRequest $request)
    {
        $exercise = Exercise::create($request->validated());

        return response()->json($exercise, 201);
    }

    public function show(Exercise $exercise)
    {
        return $exercise;
    }

    public function update(ExerciseRequest $request, Exercise $exercise)
    {
        $exercise->update($request->validated());

        return $exercise->fresh();
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return response()->json(null, 204);
    }
}
