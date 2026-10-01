#!/usr/bin/env bash
cd "$(dirname "$0")/app/backend-api" || exit 1
php artisan serve --port=8000 --no-reload
