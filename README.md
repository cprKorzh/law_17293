# Развертывание приложения на сервере

## Требования
- Docker и Docker Compose
- Node.js 20+ и npm (для сборки фронтенда)

## Первый запуск

1. Клонировать репозиторий и перейти в директорию проекта

2. Собрать фронтенд:
```bash
npm install
npm run build
```

3. Запустить контейнеры:
```bash
docker-compose up -d --build
```

Приложение будет доступно на порту 8000.

## Обновление приложения

1. Получить изменения из репозитория:
```bash
git pull
```

2. Если изменился фронтенд, пересобрать:
```bash
npm run build
```

3. Если изменился backend или зависимости, пересобрать контейнеры:
```bash
docker-compose up -d --build
```

4. Если изменились только PHP-файлы без зависимостей, достаточно перезапуска:
```bash
docker-compose restart app
```

## Миграции базы данных

Миграции выполняются автоматически при запуске контейнера.

Для ручного запуска:
```bash
docker-compose exec app php artisan migrate --force
```

## Логи

Просмотр логов приложения:
```bash
docker-compose logs -f app
```

Просмотр логов Laravel:
```bash
docker-compose exec app tail -f storage/logs/laravel.log
```

## Остановка

```bash
docker-compose down
```

Остановка с удалением данных БД:
```bash
docker-compose down -v
```
