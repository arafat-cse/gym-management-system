<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\ProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $relations = match ($user->role) {
            'member' => ['member.branch'],
            'staff' => ['staff.branch'],
            'trainer' => ['trainer.branch', 'trainer.specializations', 'trainer.schedules'],
            default => [],
        };

        return $user->load($relations);
    }

    public function update(ProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $userUpdate = array_filter([
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'gender' => $data['gender'] ?? null,
            'blood_group' => $data['blood_group'] ?? null,
            'religion' => $data['religion'] ?? null,
            'nid_number' => $data['nid_number'] ?? null,
            'birth_certificate_number' => $data['birth_certificate_number'] ?? null,
            'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
            'date_of_birth' => $data['date_of_birth'] ?? null,
        ]);

        if (! empty($data['password'])) {
            $userUpdate['password'] = Hash::make($data['password']);
        }

        if ($userUpdate) {
            $user->update($userUpdate);
        }

        if ($user->member && array_key_exists('address', $data)) {
            $user->member->update(['address' => $data['address']]);
        }

        $relations = match ($user->role) {
            'member' => ['member.branch'],
            'staff' => ['staff.branch'],
            'trainer' => ['trainer.branch', 'trainer.specializations', 'trainer.schedules'],
            default => [],
        };

        return $user->fresh()->load($relations);
    }
}
