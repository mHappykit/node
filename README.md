# Counter API

Простой REST API для управления счетчиком на Node.js с Express.

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

## Деплой

### Render (рекомендуется)
1. Зарегистрируйтесь на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите ваш GitHub репозиторий
4. Render автоматически обнаружит `render.yaml` и настроит деплой

### Railway
1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. Создайте новый проект
3. Подключите GitHub репозиторий
4. Railway автоматически настроит деплой

### Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. Запустите: `vercel`
3. Следуйте инструкциям

### Heroku
1. Установите Heroku CLI
2. Создайте приложение: `heroku create your-app-name`
3. Деплой: `git push heroku main`

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

### 5. Информация об API
- **URL:** `GET /`
- **Описание:** Возвращает информацию о доступных эндпоинтах и текущем состоянии

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
```

### JavaScript (fetch)
```javascript
// Увеличить счетчик
fetch('http://localhost:6060/increment', { method: 'POST' })
  .then(response => response.json())
  .then(data => console.log(data));

// Обнулить счетчик
fetch('http://localhost:6060/reset', { method: 'POST' })
  .then(response => response.json())
  .then(data => console.log(data));

// Получить количество запросов
fetch('http://localhost:6060/requests')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Технологии

- Node.js
- Express.js
- CORS middleware 