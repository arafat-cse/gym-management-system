<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\TrainingSessionRequest;
use App\Models\Trainer;
use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TrainingSessionController extends Controller
{
    public function index(Request $request)
    {
        return TrainingSession::with(['trainer.user'])
            ->where('member_id', $request->user()->member->id)
            ->latest('session_date')
            ->paginate(20);
    }

    public function store(TrainingSessionRequest $request)
    {
        $data = $request->validated();
        $member = $request->user()->member;

        abort_if(! $member, 422, 'Only members can book training sessions.');

        $trainer = Trainer::findOrFail($data['trainer_id']);

        $session = TrainingSession::create([
            'trainer_id' => $trainer->id,
            'member_id' => $member->id,
            'branch_id' => $member->branch_id,
            'session_date' => $data['session_date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'session_type' => $data['session_type'] ?? 'personal',
            'fee' => $trainer->session_rate,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json($session->load(['trainer.user']), 201);
    }

    public function show(Request $request, TrainingSession $trainingSession)
    {
        $this->authorizeOwner($request, $trainingSession);

        return $trainingSession->load(['trainer.user']);
    }

    public function cancel(Request $request, TrainingSession $trainingSession)
    {
        $this->authorizeOwner($request, $trainingSession);

        if (! in_array($trainingSession->status, ['pending', 'confirmed'], true)) {
            throw ValidationException::withMessages([
                'status' => ['This session can no longer be cancelled.'],
            ]);
        }

        $trainingSession->update(['status' => 'cancelled']);

        return $trainingSession;
    }

    public function rate(Request $request, TrainingSession $trainingSession)
    {
        $this->authorizeOwner($request, $trainingSession);

        if ($trainingSession->status !== 'completed') {
            throw ValidationException::withMessages([
                'status' => ['Only completed sessions can be rated.'],
            ]);
        }

        $data = $request->validate([
            'member_rating' => ['required', 'integer', 'between:1,5'],
        ]);

        $trainingSession->update(['member_rating' => $data['member_rating']]);

        $trainer = $trainingSession->trainer;
        $trainer->update([
            'rating_avg' => $trainer->trainingSessions()->whereNotNull('member_rating')->avg('member_rating'),
        ]);

        return $trainingSession;
    }

    private function authorizeOwner(Request $request, TrainingSession $trainingSession): void
    {
        abort_if($trainingSession->member_id !== $request->user()->member?->id, 403);
    }
}
