<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DietMealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meal_type' => ['required', 'in:breakfast,lunch,dinner,snack'],
            'name' => ['required', 'string', 'max:255'],
            'calories' => ['nullable', 'integer', 'min:0'],
            'protein' => ['nullable', 'numeric', 'min:0'],
            'carbs' => ['nullable', 'numeric', 'min:0'],
            'fats' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
