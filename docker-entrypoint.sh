#!/bin/sh
set -e

mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=8000
