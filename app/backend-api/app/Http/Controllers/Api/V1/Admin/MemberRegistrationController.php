<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberRegistration;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MemberRegistrationController extends Controller
{
    public function index(Request $request)
    {
        return MemberRegistration::with('branch')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);
    }

    public function show(MemberRegistration $memberRegistration)
    {
        return $memberRegistration->load('branch');
    }

    public function approve(Request $request, MemberRegistration $memberRegistration)
    {
        $registration = $memberRegistration;

        if ($registration->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['This registration has already been processed.'],
            ]);
        }

        $member = $registration->approveIntoMember($request->user()->id);

        return $member->load(['user', 'branch']);
    }

    public function reject(Request $request, MemberRegistration $memberRegistration)
    {
        $registration = $memberRegistration;

        if ($registration->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['This registration has already been processed.'],
            ]);
        }

        $data = $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $registration->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return $registration;
    }
}
