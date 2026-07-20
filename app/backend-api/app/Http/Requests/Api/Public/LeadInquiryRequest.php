<?php

namespace App\Http\Requests\Api\Public;

use Illuminate\Foundation\Http\FormRequest;

class LeadInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'membership_plan_id' => ['nullable', 'exists:membership_plans,id'],
            'message' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
