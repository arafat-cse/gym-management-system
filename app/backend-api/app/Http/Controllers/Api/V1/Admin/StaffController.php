<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StaffRequest;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index()
    {
        return Staff::with(['user', 'branch'])->paginate(20);
    }

    public function store(StaffRequest $request)
    {
        $data = $request->validated();

        $staff = DB::transaction(function () use ($data) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'staff',
                'gender' => $data['gender'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'religion' => $data['religion'] ?? null,
                'nid_number' => $data['nid_number'] ?? null,
                'birth_certificate_number' => $data['birth_certificate_number'] ?? null,
                'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'joining_date' => $data['joining_date'] ?? null,
            ]);

            return Staff::create([
                'user_id' => $user->id,
                'branch_id' => $data['branch_id'] ?? null,
                'designation' => $data['designation'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);
        });

        return response()->json($staff->load(['user', 'branch']), 201);
    }

    public function show(Staff $staff)
    {
        return $staff->load(['user', 'branch']);
    }

    public function update(StaffRequest $request, Staff $staff)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $staff) {
            $userUpdate = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'] ?? null,
                'password' => isset($data['password']) ? Hash::make($data['password']) : null,
                'gender' => $data['gender'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'religion' => $data['religion'] ?? null,
                'nid_number' => $data['nid_number'] ?? null,
                'birth_certificate_number' => $data['birth_certificate_number'] ?? null,
                'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'joining_date' => $data['joining_date'] ?? null,
            ]);

            if ($userUpdate) {
                $staff->user->update($userUpdate);
            }

            $staff->update([
                'branch_id' => $data['branch_id'] ?? $staff->branch_id,
                'designation' => $data['designation'] ?? $staff->designation,
                'status' => $data['status'] ?? $staff->status,
            ]);
        });

        return $staff->fresh(['user', 'branch']);
    }

    public function destroy(Staff $staff)
    {
        $staff->user->delete();

        return response()->json(null, 204);
    }
}
