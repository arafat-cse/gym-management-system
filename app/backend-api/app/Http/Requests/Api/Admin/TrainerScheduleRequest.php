<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TrainerScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'schedules' => ['required', 'array'],
            'schedules.*.day_of_week' => ['required', 'integer', 'between:1,7'],
            'schedules.*.start_time' => ['required', 'date_format:H:i'],
            'schedules.*.end_time' => ['required', 'date_format:H:i', 'after:schedules.*.start_time'],
            'schedules.*.is_available' => ['sometimes', 'boolean'],
            'schedules.*.max_sessions' => ['sometimes', 'integer', 'min:1'],
            'schedules.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
