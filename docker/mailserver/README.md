# Настройка почтового сервиса

## Запуск сервисов
```bash
docker-compose up -d mailserver roundcube
```

## Создание почтового аккаунта
```bash
# Войти в контейнер mailserver
docker exec -it law_17293_mailserver bash

# Создать аккаунт
setup email add noreply@law17293.local password123

# Выйти из контейнера
exit
```

## Доступ к веб-интерфейсу
- Roundcube: http://localhost:13029
- Логин: noreply@law17293.local
- Пароль: password123

## Настройки Laravel
В .env уже настроено:
- MAIL_HOST=127.0.0.1
- MAIL_PORT=587
- MAIL_USERNAME=noreply@law17293.local

## Тестирование
```bash
php artisan tinker
Mail::raw('Test message', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```
