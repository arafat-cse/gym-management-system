<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Allow approval of pending, rejected, or previously approved registrations
        if ($registration->status === 'completed') {
            throw ValidationException::withMessages([
                'status' => ['This registration is already completed.'],
            ]);
        }

        // Allow admin to add detailed information during approval
        $data = $request->validate([
            'address' => ['nullable', 'string', 'max:255'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'gender' => ['nullable', 'in:male,female,other'],
            'blood_group' => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'religion' => ['nullable', 'in:Islam,Hinduism,Christianity,Buddhism,Other'],
            'nid_number' => ['nullable', 'string', 'max:50'],
            'birth_certificate_number' => ['nullable', 'string', 'max:50'],
            'emergency_contact_number' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date'],
            'joining_date' => ['nullable', 'date'],
        ]);

        // Update registration with detailed information before approval
        $registration->update(array_filter($data));

        $member = $registration->approveIntoMember($request->user()->id);

        return $member->load(['user', 'branch']);
    }

    public function reject(Request $request, MemberRegistration $memberRegistration)
    {
        $registration = $memberRegistration;

        // Allow rejection of pending, rejected, or approved registrations
        if ($registration->status === 'completed') {
            throw ValidationException::withMessages([
                'status' => ['This registration is already completed and cannot be rejected.'],
            ]);
        }

        $data = $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($registration, $data, $request) {
            // If registration was approved, remove the member and subscriptions
            if ($registration->status === 'approved' && $registration->member) {
                $member = $registration->member;
                // Delete subscriptions
                $member->subscriptions()->delete();
                // Delete member (keep the user for potential re-approval)
                $member->delete();
            }

            $registration->update([
                'status' => 'rejected',
                'rejection_reason' => $data['rejection_reason'] ?? null,
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'member_id' => null, // Remove the member reference
            ]);
        });

        return $registration;
    }
}
