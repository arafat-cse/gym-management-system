<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';
        $couponId = $this->route('coupon')?->id;

        return [
            'code' => [$required, 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($couponId)],
            'type' => [$required, 'in:percentage,fixed'],
            'discount' => [$required, 'numeric', 'min:0'],
            'min_order' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'status' => ['sometimes', 'in:active,inactive'],
        ];
    }
}
