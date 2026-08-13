<?php

namespace App\Http\Requests\Api\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Basic information - collected during registration
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'unique:users,email',
                Rule::unique('member_registrations', 'email')->where('status', 'pending'),
            ],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:30'],

            // These detailed fields will be filled by admin/staff later
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
        ];
    }
}
