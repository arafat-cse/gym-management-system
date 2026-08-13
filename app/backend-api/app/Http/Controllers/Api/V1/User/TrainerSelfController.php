<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\TrainerScheduleRequest;
use App\Http\Requests\Api\Admin\TrainerSpecializationRequest;
use App\Models\Trainer;
use App\Models\TrainerSpecialization;
use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrainerSelfController extends Controller
{
    private function trainer(Request $request): Trainer
    {
        $trainer = $request->user()->trainer;

        abort_if(! $trainer, 403);

        return $trainer;
    }

    public function schedule(Request $request)
    {
        return $this->trainer($request)->schedules()->orderBy('day_of_week')->get();
    }

    public function updateSchedule(TrainerScheduleRequest $request)
    {
        $trainer = $this->trainer($request);
        $data = $request->validated();

        DB::transaction(function () use ($data, $trainer) {
            $trainer->schedules()->delete();

            foreach ($data['schedules'] as $schedule) {
                $trainer->schedules()->create([
                    'day_of_week' => $schedule['day_of_week'],
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time'],
                    'is_available' => $schedule['is_available'] ?? true,
                    'max_sessions' => $schedule['max_sessions'] ?? 1,
                    'notes' => $schedule['notes'] ?? null,
                ]);
            }
        });

        return $trainer->schedules()->orderBy('day_of_week')->get();
    }

    public function sessions(Request $request)
    {
        $trainer = $this->trainer($request);

        return TrainingSession::with('member.user')
            ->where('trainer_id', $trainer->id)
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest('session_date')
            ->paginate(20);
    }

    public function updateSession(Request $request, TrainingSession $trainingSession)
    {
        $trainer = $this->trainer($request);

        abort_if($trainingSession->trainer_id !== $trainer->id, 403);

        $data = $request->validate([
            'status' => ['sometimes', 'in:confirmed,completed,cancelled,no_show'],
            'trainer_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $wasCompleted = $trainingSession->status === 'completed';
        $trainingSession->update($data);

        if (! $wasCompleted && $trainingSession->status === 'completed') {
            $trainer->increment('total_sessions');
        }

        return $trainingSession->fresh('member.user');
    }

    public function specializations(Request $request)
    {
        return $this->trainer($request)->specializations;
    }

    public function addSpecialization(TrainerSpecializationRequest $request)
    {
        $specialization = $this->trainer($request)->specializations()->create($request->validated());

        return response()->json($specialization, 201);
    }

    public function removeSpecialization(Request $request, TrainerSpecialization $specialization)
    {
        $trainer = $this->trainer($request);

        abort_if($specialization->trainer_id !== $trainer->id, 404);

        $specialization->delete();

        return response()->json(null, 204);
    }

    public function receivedReviews(Request $request)
    {
        return $this->trainer($request)->reviews()->with('member.user')->latest()->paginate(20);
    }
}
