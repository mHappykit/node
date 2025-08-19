# Counter API

Простой REST API для управления счетчиком на Node.js с Express. Также содержит прокси-эндпоинт для курсов валют Pegast и тестовые VAST-эндпоинты.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер:
```bash
# Для разработки (с автоперезагрузкой)
npm run dev

# Для продакшена
npm start
```

Сервер будет доступен по адресу: `http://localhost:6060`

### Переменные окружения
- `PORT` (опционально): порт сервера. По умолчанию `6060`.

## Деплой

### Render (рекомендуется)
1. Зарегистрируйтесь на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите ваш GitHub репозиторий
4. Render автоматически обнаружит `render.yaml` и настроит деплой

## API Endpoints

### 1. Увеличить счетчик
- **URL:** `POST /increment`
- **Описание:** Увеличивает значение счетчика на 1
- **Ответ:**
```json
{
  "success": true,
  "message": "Счетчик увеличен",
  "counter": 1
}
```

### 2. Обнулить счетчик
- **URL:** `POST /reset`
- **Описание:** Обнуляет значение счетчика
- **Ответ:**
```json
{
  "success": true,
  "message": "Счетчик обнулен",
  "counter": 0
}
```

### 3. Получить количество запросов
- **URL:** `GET /requests`
- **Описание:** Возвращает общее количество запросов к API
- **Ответ:**
```json
{
  "success": true,
  "requestCount": 5,
  "message": "Общее количество запросов: 5"
}
```

### 4. Получить текущее значение счетчика
- **URL:** `GET /counter`
- **Описание:** Возвращает текущее значение счетчика
- **Ответ:**
```json
{
  "success": true,
  "counter": 3,
  "message": "Текущее значение счетчика: 3"
}
```

### 5. Курс валют (Pegast)
- **URL:** `POST /exchange-rates`
- **Описание:** Проксирует запрос к `https://agency.pegast.ru/ExchangeRates/GetExchangeRates`. 
- **Тело запроса:** `application/json`
```json
{ "date": "YYYY-MM-DD" }
```
  - `date` (опционально): если не указано, отправляется `null`.
- **Успешный ответ:**
```json
{
  "success": true,
  "data": { /* ответ Pegast, возможно большой */ }
}
```
- **Ответ об ошибке (пример):**
```json
{ "error": "Ошибка при получении курсов" }
```

### 6. Тестовый VAST XML
- **URL:** `GET /vast`
- **Описание:** Возвращает тестовый VAST XML (Content-Type: `application/xml`). Также логирует запрос в файл `vast_requests.log` (содержит `IP`, `Origin`, `Referer`).
- **Ответ:** XML-документ VAST 4.2.

### 7. Проксированный VAST XML
- **URL:** `GET /proxyVast`
- **Описание:** Проксирует XML из `https://counter-ads.onrender.com/vast` и возвращает как `application/xml`.

## Примеры использования

### cURL
```bash
# Увеличить счетчик
curl -X POST http://localhost:6060/increment

# Обнулить счетчик
curl -X POST http://localhost:6060/reset

# Получить количество запросов
curl http://localhost:6060/requests

# Получить значение счетчика
curl http://localhost:6060/counter

# Получить курсы валют (с датой)
curl -X POST http://localhost:6060/exchange-rates \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-08-11"}'

# Получить курсы валют (без даты)
curl -X POST http://localhost:6060/exchange-rates \
  -H "Content-Type: application/json" \
  -d '{}'

# Получить тестовый VAST XML
curl http://localhost:6060/vast

# Получить проксированный VAST XML
curl http://localhost:6060/proxyVast
```

## Логи

- `vast_requests.log` — файл с логами запросов к `GET /vast` (дата/время, IP, Origin, Referer).