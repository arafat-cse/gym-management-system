<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentNumber extends Model
{
    protected $fillable = ['method', 'number', 'label', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
