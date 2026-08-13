<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ExerciseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'name' => [$required, 'string', 'max:255'],
            'category' => ['sometimes', 'in:cardio,strength,flexibility,balance'],
            'muscle_group' => ['nullable', 'string', 'max:255'],
            'equipment_needed' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
