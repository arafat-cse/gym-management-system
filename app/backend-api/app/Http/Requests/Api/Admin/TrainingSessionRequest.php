<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TrainingSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:pending,confirmed,completed,cancelled,no_show'],
            'session_date' => ['sometimes', 'date'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i'],
            'fee' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['sometimes', 'in:paid,pending,refunded'],
            'trainer_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
