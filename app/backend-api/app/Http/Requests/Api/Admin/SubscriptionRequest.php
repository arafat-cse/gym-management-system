<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'member_id' => ['required', 'exists:members,id'],
                'membership_plan_id' => ['required', 'exists:membership_plans,id'],
                'start_date' => ['nullable', 'date'],
                'price_paid' => ['nullable', 'numeric', 'min:0'],
                'status' => ['sometimes', 'in:pending,active,expired,cancelled'],
                'notes' => ['nullable', 'string', 'max:1000'],
            ];
        }

        return [
            'status' => ['sometimes', 'in:pending,active,expired,cancelled'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'price_paid' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
