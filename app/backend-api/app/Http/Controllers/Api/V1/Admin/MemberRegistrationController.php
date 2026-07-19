<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\User;
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

        if ($registration->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['This registration has already been processed.'],
            ]);
        }

        $member = DB::transaction(function () use ($registration, $request) {
            $user = User::create([
                'first_name' => $registration->first_name,
                'last_name' => $registration->last_name,
                'email' => $registration->email,
                'phone' => $registration->phone,
                'password' => $registration->password,
                'role' => 'member',
                'gender' => $registration->gender,
                'blood_group' => $registration->blood_group,
                'religion' => $registration->religion,
                'nid_number' => $registration->nid_number,
                'birth_certificate_number' => $registration->birth_certificate_number,
                'emergency_contact_number' => $registration->emergency_contact_number,
                'date_of_birth' => $registration->date_of_birth,
                'joining_date' => $registration->joining_date,
            ]);

            $member = Member::create([
                'user_id' => $user->id,
                'branch_id' => $registration->branch_id,
                'address' => $registration->address,
            ]);

            $registration->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            return $member;
        });

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
