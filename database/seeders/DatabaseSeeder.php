<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Создаем администратора
        User::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'tel' => '+7 900 123 45 67',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'group_id' => 1,
        ]);

        // Создаем 50 случайных пользователей через factory
        User::factory(50)->create();
    }
}
