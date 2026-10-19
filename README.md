# Завдання 3: фронтенд для вебзастосунку, який дозволяє користувачам ділитися цитатами

Стандартний набір CRUD для функціоналу цитат на Deno (RIP) + Fresh 2.

## Запуск

Перед будь-яким способом переконайтеся, що бекенд уже запущений і відповідає на запити.

### Спосіб 1: через архів `_fresh` з Releases

1. Завантажте `quotes-frontend.7z` з релізів і розпакуйте.
2. У розпакованій теці буде каталог `_fresh/`.
3. Запустіть сервер:

   ```bash
   deno serve -A _fresh/server.js
   ```

   Якщо потрібен інший бекенд, задайте змінну перед запуском:

   ```bash
   BACKEND_URL=http://localhost:8080 deno serve -A _fresh/server.js
   ```

4. Відкрийте в браузері адресу, яку виведе Deno (зазвичай `http://localhost:8000`).

### Спосіб 2: через виконуваний файл з Releases

У релізах лежать зібрані бінарники (145+- МБ) для Linux і Windows. Вони містять і runtime, і зібраний застосунок.

1. Завантажте файл для своєї системи.
2. Linux:

   ```bash
   chmod +x quotes-frontend
   ./quotes-frontend
   ```

   Windows:

   ```powershell
   .\quotes-frontend.exe
   ```

3. Deno двічі запитає дозволи, вам треба натиснути `A` обидва рази. Виконуваний файл слухає лише localhost і звертається до бекенду за `BACKEND_URL`.
4. Адреса сайту з’явиться в консолі. Інший бекенд:

   ```bash
   BACKEND_URL=http://127.0.0.1:8080 ./quotes-frontend
   ```

### Спосіб 3: з репозиторію

Потрібні Deno 2+ і git.

1. Клонуйте репозиторій:

   ```bash
   git clone https://github.com/Official-Echo/task3-fido-quotes-frontend
   cd task3-fido-quotes-frontend
   ```

2. (Опційно) скопіюйте `.env.example` у `.env` і змініть `BACKEND_URL`, якщо бекенд не на `localhost:8080`.
3. Встановіть залежності, зберіть і запустіть:

   ```bash
   deno install --allow-scripts
   deno task build
   deno task start:local
   ```

### Спосіб 4: через Docker Compose

Необхідно лише Docker.

1. У `docker-compose.yml` перевірте `BACKEND_URL`. За замовчуванням стоїть `http://host.docker.internal:8080`, щоб контейнер бачив бекенд на хості. Змініть значення, якщо він знаходиться на іншому порті/URL.
2. Зберіть і запустіть:

   ```bash
   docker compose up --build
   ```

3. Сайт буде на `http://localhost:8000`. Зупинка: `docker compose down`.

## Тести

```bash
deno task test
```

Якщо необхідно покриття, можна додати прапорець `--coverage`, результати будуть у теці `/coverage/`

Перевірка на форматування, lint, типи, тести:

```bash
deno task check
```

Для тестів бекенд не потрібен.
