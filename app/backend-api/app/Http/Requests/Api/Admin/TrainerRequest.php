<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrainerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $trainer = $this->route('trainer');
        $userId = $trainer?->user_id;

        if ($this->isMethod('post')) {
            return [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', 'min:6'],
                'branch_id' => ['nullable', 'exists:branches,id'],
                'employee_id' => ['nullable', 'string', 'max:255', 'unique:trainers,employee_id'],
                'specialization' => ['nullable', 'string', 'max:255'],
                'certifications' => ['nullable', 'array'],
                'experience_years' => ['nullable', 'integer', 'min:0'],
                'hourly_rate' => ['nullable', 'numeric', 'min:0'],
                'session_rate' => ['nullable', 'numeric', 'min:0'],
                'bio' => ['nullable', 'string'],
                'status' => ['sometimes', 'in:active,on_leave,inactive'],
                'join_date' => ['nullable', 'date'],
                'gender' => ['nullable', 'in:male,female,other'],
                'blood_group' => ['nullable', 'string', 'max:10'],
                'religion' => ['nullable', 'string', 'max:100'],
                'nid_number' => ['nullable', 'string', 'max:50'],
                'birth_certificate_number' => ['nullable', 'string', 'max:50'],
                'emergency_contact_number' => ['nullable', 'string', 'max:30'],
                'date_of_birth' => ['nullable', 'date'],
            ];
        }

        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['sometimes', 'string', 'min:6'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'employee_id' => ['nullable', 'string', 'max:255', Rule::unique('trainers', 'employee_id')->ignore($trainer?->id)],
            'specialization' => ['nullable', 'string', 'max:255'],
            'certifications' => ['nullable', 'array'],
            'experience_years' => ['nullable', 'integer', 'min:0'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'session_rate' => ['nullable', 'numeric', 'min:0'],
            'bio' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,on_leave,inactive'],
            'join_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'religion' => ['nullable', 'string', 'max:100'],
            'nid_number' => ['nullable', 'string', 'max:50'],
            'birth_certificate_number' => ['nullable', 'string', 'max:50'],
            'emergency_contact_number' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date'],
        ];
    }
}
