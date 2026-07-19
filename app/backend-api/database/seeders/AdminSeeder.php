<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gms.test'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
