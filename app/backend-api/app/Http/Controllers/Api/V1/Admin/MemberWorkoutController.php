<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\MemberWorkoutRequest;
use App\Models\MemberWorkout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberWorkoutController extends Controller
{
    public function index(Request $request)
    {
        return MemberWorkout::with(['member.user', 'trainer.user', 'exercises.exercise'])
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest('date')
            ->paginate(20);
    }

    public function store(MemberWorkoutRequest $request)
    {
        $data = $request->validated();
        $exercises = $data['exercises'] ?? [];
        unset($data['exercises']);

        $workout = DB::transaction(function () use ($data, $exercises) {
            $workout = MemberWorkout::create($data);

            foreach ($exercises as $exercise) {
                $workout->exercises()->create($exercise);
            }

            return $workout;
        });

        return response()->json($workout->load(['member.user', 'trainer.user', 'exercises.exercise']), 201);
    }

    public function show(MemberWorkout $memberWorkout)
    {
        return $memberWorkout->load(['member.user', 'trainer.user', 'exercises.exercise']);
    }

    public function update(MemberWorkoutRequest $request, MemberWorkout $memberWorkout)
    {
        $data = $request->validated();
        $exercises = $data['exercises'] ?? null;
        unset($data['exercises']);

        DB::transaction(function () use ($data, $exercises, $memberWorkout) {
            $memberWorkout->update($data);

            if ($exercises !== null) {
                $memberWorkout->exercises()->delete();

                foreach ($exercises as $exercise) {
                    $memberWorkout->exercises()->create($exercise);
                }
            }
        });

        return $memberWorkout->fresh(['member.user', 'trainer.user', 'exercises.exercise']);
    }

    public function destroy(MemberWorkout $memberWorkout)
    {
        $memberWorkout->delete();

        return response()->json(null, 204);
    }
}
