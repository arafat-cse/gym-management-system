<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MemberWorkoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'member_id' => [$required, 'exists:members,id'],
            'trainer_id' => ['nullable', 'exists:trainers,id'],
            'date' => [$required, 'date'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'type' => ['sometimes', 'in:personal,group,cardio,strength,mixed'],
            'intensity' => ['sometimes', 'in:low,medium,high'],
            'calories_burned' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'in:scheduled,completed,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'exercises' => ['sometimes', 'array'],
            'exercises.*.exercise_id' => ['required_with:exercises', 'exists:exercises,id'],
            'exercises.*.sets' => ['nullable', 'integer', 'min:0'],
            'exercises.*.reps' => ['nullable', 'integer', 'min:0'],
            'exercises.*.weight' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
