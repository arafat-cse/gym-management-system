<?php

namespace Database\Seeders;

use App\Models\PaymentNumber;
use Illuminate\Database\Seeder;

class PaymentNumberSeeder extends Seeder
{
    public function run(): void
    {
        $paymentMethods = [
            [
                'method' => 'bkash',
                'number' => '01712345678', // আপনার বিকাশ নম্বর দিন
                'label' => 'Personal',
                'is_active' => true,
            ],
            [
                'method' => 'nagad',
                'number' => '01812345678', // আপনার নগদ নম্বর দিন
                'label' => 'Personal',
                'is_active' => true,
            ],
        ];

        foreach ($paymentMethods as $method) {
            PaymentNumber::firstOrCreate(
                ['number' => $method['number']],
                $method
            );
        }
    }
}