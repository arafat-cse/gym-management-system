<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\TrainerRequest;
use App\Http\Requests\Api\Admin\TrainerScheduleRequest;
use App\Http\Requests\Api\Admin\TrainerSpecializationRequest;
use App\Models\Trainer;
use App\Models\TrainerSpecialization;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TrainerController extends Controller
{
    public function index()
    {
        return Trainer::with(['user', 'branch'])->paginate(20);
    }

    public function store(TrainerRequest $request)
    {
        $data = $request->validated();

        $trainer = DB::transaction(function () use ($data) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'trainer',
                'gender' => $data['gender'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'religion' => $data['religion'] ?? null,
                'nid_number' => $data['nid_number'] ?? null,
                'birth_certificate_number' => $data['birth_certificate_number'] ?? null,
                'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
            ]);

            return Trainer::create([
                'user_id' => $user->id,
                'branch_id' => $data['branch_id'] ?? null,
                'employee_id' => $data['employee_id'] ?? null,
                'specialization' => $data['specialization'] ?? null,
                'certifications' => $data['certifications'] ?? null,
                'experience_years' => $data['experience_years'] ?? 0,
                'hourly_rate' => $data['hourly_rate'] ?? null,
                'session_rate' => $data['session_rate'] ?? null,
                'bio' => $data['bio'] ?? null,
                'status' => $data['status'] ?? 'active',
                'join_date' => $data['join_date'] ?? null,
            ]);
        });

        return response()->json($trainer->load(['user', 'branch']), 201);
    }

    public function show(Trainer $trainer)
    {
        return $trainer->load(['user', 'branch', 'specializations', 'schedules']);
    }

    public function update(TrainerRequest $request, Trainer $trainer)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $trainer) {
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
            ]);

            if ($userUpdate) {
                $trainer->user->update($userUpdate);
            }

            $trainer->update([
                'branch_id' => $data['branch_id'] ?? $trainer->branch_id,
                'employee_id' => $data['employee_id'] ?? $trainer->employee_id,
                'specialization' => $data['specialization'] ?? $trainer->specialization,
                'certifications' => $data['certifications'] ?? $trainer->certifications,
                'experience_years' => $data['experience_years'] ?? $trainer->experience_years,
                'hourly_rate' => $data['hourly_rate'] ?? $trainer->hourly_rate,
                'session_rate' => $data['session_rate'] ?? $trainer->session_rate,
                'bio' => $data['bio'] ?? $trainer->bio,
                'status' => $data['status'] ?? $trainer->status,
                'join_date' => $data['join_date'] ?? $trainer->join_date,
            ]);
        });

        return $trainer->fresh(['user', 'branch']);
    }

    public function destroy(Trainer $trainer)
    {
        $trainer->user->delete();

        return response()->json(null, 204);
    }

    public function schedule(Trainer $trainer)
    {
        return $trainer->schedules()->orderBy('day_of_week')->get();
    }

    public function updateSchedule(TrainerScheduleRequest $request, Trainer $trainer)
    {
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

    public function specializations(Trainer $trainer)
    {
        return $trainer->specializations;
    }

    public function addSpecialization(TrainerSpecializationRequest $request, Trainer $trainer)
    {
        $specialization = $trainer->specializations()->create($request->validated());

        return response()->json($specialization, 201);
    }

    public function removeSpecialization(Trainer $trainer, TrainerSpecialization $specialization)
    {
        abort_if($specialization->trainer_id !== $trainer->id, 404);

        $specialization->delete();

        return response()->json(null, 204);
    }
}
