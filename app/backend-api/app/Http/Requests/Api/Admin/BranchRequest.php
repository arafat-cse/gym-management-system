<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'status' => ['sometimes', 'in:active,inactive'],
            'contact_details' => ['nullable', 'array'],
            'contact_details.phones' => ['nullable', 'array'],
            'contact_details.phones.*' => ['string', 'max:30'],
            'contact_details.emails' => ['nullable', 'array'],
            'contact_details.emails.*' => ['email', 'max:255'],
            'operating_hours' => ['nullable', 'array'],
        ];
    }
}
