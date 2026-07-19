<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PaymentNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'method' => [$this->isMethod('post') ? 'required' : 'sometimes', 'in:bkash,nagad'],
            'number' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
