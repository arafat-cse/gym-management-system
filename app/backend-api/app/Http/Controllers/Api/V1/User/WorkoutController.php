<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\MemberWorkout;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class WorkoutController extends Controller
{
    public function index(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return MemberWorkout::with(['trainer.user', 'exercises.exercise'])
            ->where('member_id', $member->id)
            ->latest('date')
            ->paginate(20);
    }

    public function show(Request $request, MemberWorkout $memberWorkout)
    {
        $this->authorizeOwner($request, $memberWorkout);

        return $memberWorkout->load(['trainer.user', 'exercises.exercise']);
    }

    public function complete(Request $request, MemberWorkout $memberWorkout)
    {
        $this->authorizeOwner($request, $memberWorkout);

        if ($memberWorkout->status !== 'scheduled') {
            throw ValidationException::withMessages([
                'status' => ['Only scheduled workouts can be marked complete.'],
            ]);
        }

        $data = $request->validate([
            'calories_burned' => ['nullable', 'integer', 'min:0'],
        ]);

        $memberWorkout->update([
            'status' => 'completed',
            'calories_burned' => $data['calories_burned'] ?? $memberWorkout->calories_burned,
        ]);

        return $memberWorkout;
    }

    public function exercises()
    {
        return Exercise::paginate(20);
    }

    private function authorizeOwner(Request $request, MemberWorkout $memberWorkout): void
    {
        abort_if($memberWorkout->member_id !== $request->user()->member?->id, 403);
    }
}
