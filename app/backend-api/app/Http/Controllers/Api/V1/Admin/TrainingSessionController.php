<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\TrainingSessionRequest;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class TrainingSessionController extends Controller
{
    public function index(Request $request)
    {
        return TrainingSession::with(['trainer.user', 'member.user'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('trainer_id'), fn ($q, $trainerId) => $q->where('trainer_id', $trainerId))
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->latest('session_date')
            ->paginate(20);
    }

    public function show(TrainingSession $trainingSession)
    {
        return $trainingSession->load(['trainer.user', 'member.user']);
    }

    public function update(TrainingSessionRequest $request, TrainingSession $trainingSession)
    {
        $data = $request->validated();
        $wasCompleted = $trainingSession->status === 'completed';

        $trainingSession->update($data);

        if (! $wasCompleted && $trainingSession->status === 'completed') {
            $trainingSession->trainer->increment('total_sessions');
        }

        return $trainingSession->fresh(['trainer.user', 'member.user']);
    }
}
