<?php

namespace App\Http\Requests\Api\Admin;

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
            'status' => ['sometimes', 'in:new,contacted,converted,closed'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
