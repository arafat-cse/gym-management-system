<?php

namespace App\Http\Requests\Api\Public;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'membership_plan_id' => ['required', 'exists:membership_plans,id'],
            'method' => ['required', 'in:bkash,nagad'],
            'sender_number' => ['required', 'string', 'max:30'],
            'transaction_id' => ['required', 'string', 'max:255', 'unique:payments,transaction_id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'screenshot' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
