<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TrainerSpecializationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'specialization_name' => ['required', 'string', 'max:255'],
            'certification_level' => ['nullable', 'in:beginner,intermediate,advanced,expert'],
            'certification_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:certification_date'],
            'issuing_authority' => ['nullable', 'string', 'max:255'],
        ];
    }
}
