#!/bin/bash
set -e

# Ждем, пока база данных будет готова
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Генерация ключа приложения, если он не установлен
php artisan key:generate --force

# Запуск миграций
php artisan migrate --force

# Создание администратора
php artisan tinker --execute="
if (!\App\Models\User::where('email', 'cprkorzh@example.com')->exists()) {
    \App\Models\User::create([
        'name' => 'admin',
        'username' => 'admin',
        'email' => 'admin@example.com',
        'tel' => '+7-900-000-0000',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'group_id' => 1
    ]);
    echo 'Admin user created successfully';
} else {
    echo 'Admin user already exists';
}
"

# Запуск PHP-FPM
php-fpm
