<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LockerRequest extends FormRequest
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
            'number' => [$required, 'string', 'max:50'],
            'size' => ['sometimes', 'in:small,medium,large'],
            'status' => ['sometimes', 'in:available,occupied,maintenance'],
        ];
    }
}
