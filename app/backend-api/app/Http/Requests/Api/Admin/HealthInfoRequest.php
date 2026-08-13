<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HealthInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_id' => ['required', 'exists:members,id'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'blood_type' => ['nullable', 'string', 'max:10'],
            'allergies' => ['nullable', 'string'],
            'conditions' => ['nullable', 'string'],
            'medications' => ['nullable', 'string'],
            'emergency_contact' => ['nullable', 'string', 'max:30'],
        ];
    }
}
