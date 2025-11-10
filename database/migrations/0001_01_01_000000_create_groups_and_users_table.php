<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Создаем таблицу групп
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Пересоздаем таблицу users
        Schema::dropIfExists('users');
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('surname')->nullable();
            $table->string('patronimic')->nullable();
            $table->string('username')->unique();
            $table->string('email')->nullable();
            $table->string('tel');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('password_set_at')->nullable(); // Отслеживание активации через ссылку
            $table->string('password');
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->foreignId('group_id')->constrained('groups');
            $table->boolean('training_suspended')->default(false);
            $table->enum('suspension_reason', ['theory_completed', 'user_request', 'expired'])->nullable();
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Добавляем базовые группы
        DB::table('groups')->insert([
            ['name' => 'Группа A', 'description' => 'Основная группа', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Группа B', 'description' => 'Дополнительная группа', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Пересоздаем остальные таблицы
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
