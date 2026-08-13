<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'category' => ['sometimes', 'in:rent,utilities,salary,equipment,maintenance,marketing,other'],
            'amount' => [$required, 'numeric', 'min:0'],
            'date' => [$required, 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
