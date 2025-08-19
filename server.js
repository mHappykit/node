const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6060;

// Middleware
app.use(cors());
app.use(express.json());

// Глобальные переменные для хранения состояния
let counter = 0;
let requestCount = 0;

// Middleware для подсчета запросов
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Эндпоинт для увеличения счетчика
app.post('/increment', (req, res) => {
  counter++;
  res.json({
    success: true,
    message: 'Счетчик увеличен',
    counter: counter
  });
});

// Эндпоинт для обнуления счетчика
app.post('/reset', (req, res) => {
  counter = 0;
  res.json({
    success: true,
    message: 'Счетчик обнулен',
    counter: counter
  });
});

// Эндпоинт для получения количества запросов
app.get('/requests', (req, res) => {
  res.json({
    success: true,
    requestCount: requestCount,
    message: `Общее количество запросов: ${requestCount}`
  });
});

// Дополнительный эндпоинт для получения текущего значения счетчика
app.get('/counter', (req, res) => {
  res.json({
    success: true,
    counter: counter,
    message: `Текущее значение счетчика: ${counter}`
  });
});

// Прокси-эндпоинт для запроса к Pegast API



app.post('/exchange-rates', async (req, res) => {
  try {
    const { date } = req.body;  // ожидаем, что придёт { date: "2025-08-11" } или null

    const pageRes = await fetch('https://agency.pegast.ru/ExchangeRates', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Accept-Language': 'ru,ru-RU;q=0.9,en;q=0.8',
      }
    });

    // Извлекаем куки из Set-Cookie
    const rawCookies = pageRes.headers.raw()['set-cookie'] || [];
    const cookies = rawCookies.map(c => c.split(';')[0]).join('; ');

    // Формируем тело запроса к API Pegast, подставляя дату если есть
    const bodyPayload = {
      date: date || null
    };

    // 3) Отправляем POST запрос к API с правильными заголовками
    const apiRes = await fetch('https://agency.pegast.ru/ExchangeRates/GetExchangeRates', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'ru,ru-RU;q=0.9,en;q=0.8',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': cookies,
        'DNT': '1',
        'Origin': 'https://agency.pegast.ru',
        'Referer': 'https://agency.pegast.ru/ExchangeRates',
        'Sec-CH-UA': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-KL-KFA-Ajax-Request': 'Ajax_Request',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(bodyPayload),
    });

    function replaceNewDateWithISOString(str) {
      return str.replace(/new Date\((\d+)\)/g, (_, timestamp) => {
        const date = new Date(Number(timestamp));
        return `"${date.toISOString()}"`;
      });
    }

    let raw = await apiRes.text();

    raw = replaceNewDateWithISOString(raw);
    const data = {
      success: true,
      data: JSON.parse(raw)
    };

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении курсов' });
  }
});

app.get('/vast', (req, res) => {
  const origin = req.headers.origin || '-';
  const referer = req.headers.referer || '-';
  const host = req.headers.host;
  const ip = req.ip;

  // Лог в консоль
  console.log('--- Запрос на VAST ---');
  console.log('Дата:', new Date().toISOString());
  console.log('IP клиента:', ip);
  console.log('Домен источника (Origin):', origin);
  console.log('Реферер (Referer):', referer);
  console.log('Ваш сервер (Host):', host);

  // Лог в файл
  const logLine = `${new Date().toISOString()} | IP: ${ip} | Origin: ${origin} | Referer: ${referer}\n`;
  fs.appendFileSync(path.join(__dirname, 'vast_requests.log'), logLine);

  // Отдаём тестовый VAST
  res.setHeader('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="4.2">
    <Ad id="BXkG52XD">
        <InLine>
            <AdTitle>AD mish</AdTitle>
            <Error/>
            <Impression/>
            <Creatives>
                <Creative id="OrVYL9Me">
                    <Linear skipoffset="00:00:05">
                        <Duration>00:01:14.000</Duration>
                        <MediaFiles>
                            <MediaFile delivery="progressive" type="video/avi" width="800" height="450" bitrate="818" scalable="true" maintainAspectRatio="true">
                                <![CDATA[ https://s3-user-b6a1f8-default-bucket.storage.clo.ru/mish/content-avi.avi?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=JBBBDVKX6T3EBNE44A0L/20250327/us-east-1/s3/aws4_request&X-Amz-Date=20250327T084157Z&X-Amz-Expires=604798&X-Amz-SignedHeaders=host&X-Amz-Signature=eb522683c4fb2d4d0bddb4896921d1730963e026e65313dd5d2f5cc5e3952988 ]]>
                            </MediaFile>
                            <MediaFile delivery="progressive" type="video/mp4" width="800" height="450" bitrate="818" scalable="true" maintainAspectRatio="true">
                                <![CDATA[ https://s3-user-b6a1f8-default-bucket.storage.clo.ru/mish/ads.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=JBBBDVKX6T3EBNE44A0L/20250819/default/s3/aws4_request&X-Amz-Date=20250819T091750Z&X-Amz-Expires=604798&X-Amz-SignedHeaders=host&X-Amz-Signature=c45df0b83b412fe2d627ff172c1d06febbb9d757b60576e4b127f799b8bd9fa0]]>
                            </MediaFile>
                        </MediaFiles>
                    </Linear>
                </Creative>
            </Creatives>
        </InLine>
    </Ad>
</VAST>`);
});

app.get("/proxyVast", async (req, res) => {
  const vastUrl = "https://node-1l98.onrender.com/vast";
  const response = await fetch(vastUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
      'Referer': 'https://adwebs.pro/',
      'Origin': 'https://adwebs.pro',
    }
  });
  const xml = await response.text();

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  const now = new Date().toISOString();
  console.log("===========================================");
  console.log(`🚀 Сервер запущен`);
  console.log(`📅 Время запуска: ${now}`);
  console.log(`🌍 Среда: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔌 Порт: ${PORT}`);
  console.log(`📡 API доступен по адресу: http://localhost:${PORT}`);
  console.log("📖 Доступные эндпоинты:");
  console.log("  ➕ POST /increment       - увеличить счетчик");
  console.log("  ♻️  POST /reset           - обнулить счетчик");
  console.log("  🔢 GET  /counter         - получить значение счетчика");
  console.log("  📊 GET  /requests        - получить количество запросов");
  console.log("  💱 POST /exchange-rates  - проксировать запрос к Pegast API");
  console.log("  🎬 GET  /vast            - получить тестовый VAST XML");
  console.log("  🎬 GET  /proxyVast       - получить проксированный VAST XML");
  console.log("===========================================");
});