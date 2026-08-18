# Cheerful Squirrels — Backend (Harmoniq)

Бекенд командного проєкту **Harmoniq** — платформи для читання та публікації статей. Забезпечує авторизацію користувачів, роботу зі статтями (створення, редагування, категорії, пагінація), збережені статті (закладки) та завантаження зображень.

## Стек технологій

- **Node.js** + **Express 5** (ESM-модулі)
- **MongoDB** + **Mongoose**
- **bcrypt** — хешування паролів
- **celebrate / Joi** — валідація запитів
- **Cloudinary** — зберігання зображень
- **multer** + **sharp** — завантаження та стиснення фото
- **cookie-parser** — робота з httpOnly-куками

## Авторизація

Авторизація сесійна, через **httpOnly-куки** (`sessionId`, `accessToken`, `refreshToken`), а не через `Authorization`-заголовок. Записи про сесії зберігаються в колекції `Session` у MongoDB.

- `accessToken` живе **15 хвилин**
- `refreshToken` живе **1 добу**

Коли `accessToken` протух — фронт має викликати `POST /auth/refresh`, а не змушувати юзера логінитись заново.

> ⚠️ Куки виставляються з `secure: true, sameSite: 'none'`, тому при локальній розробці по звичайному HTTP (не HTTPS) браузер їх мовчки відкидає. Це впливає на будь-який ендпоінт, що потребує авторизації, коли фронт і бекенд — окремі локальні сервери.

## Встановлення та запуск

```bash
npm install
cp .env.example .env   # і заповнити значення (див. нижче)
npm run dev             # запуск через nodemon (з автоперезапуском)
# або
npm run start            # звичайний запуск
```

Після запуску сервер доступний на `http://localhost:<PORT>`.

## Змінні середовища (`.env`)

| Змінна                  | Опис                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `PORT`                  | Порт, на якому запускається сервер (наприклад `3000`)        |
| `NODE_ENV`              | `development` / `production`                                 |
| `MONGO_URL`             | Рядок підключення до MongoDB (локальної або Atlas)           |
| `JWT_SECRET`            | Секретний рядок                                              |
| `FRONTEND_DOMAIN`       | Домен фронтенду — має використовуватись у CORS-налаштуваннях |
| `CLOUDINARY_CLOUD_NAME` | Ім'я хмари Cloudinary                                        |
| `CLOUDINARY_API_KEY`    | API-ключ Cloudinary                                          |
| `CLOUDINARY_API_SECRET` | API-секрет Cloudinary                                        |

## Структура проєкту

```
src/
├── constants/        # константи (наприклад, тривалість токенів)
├── controllers/      # обробники запитів
├── db/               # підключення до MongoDB
├── middleware/       # authenticate, checkArticleOwner, compressImage, logger, errorHandler...
├── models/           # Mongoose-схеми: User, Article, Session
├── routes/           # маршрути: auth, users, articles
├── services/         # бізнес-логіка (сесії, вибірка статей)
├── utils/            # допоміжні функції (відповіді, завантаження в Cloudinary)
├── validations/      # Joi-схеми валідації
├── server.js         # точка входу
```

## API — основні ендпоінти

### Auth

| Метод | Шлях             | Опис                                   |
| ----- | ---------------- | -------------------------------------- |
| POST  | `/auth/register` | Реєстрація `{ name, email, password }` |
| POST  | `/auth/login`    | Вхід `{ email, password }`             |
| POST  | `/auth/logout`   | Вихід, очищення сесії/кук              |
| POST  | `/auth/refresh`  | Оновлення access/refresh токенів       |

### Users

| Метод  | Шлях                      | Опис                                         |
| ------ | ------------------------- | -------------------------------------------- |
| GET    | `/users/me`               | Поточний користувач (потрібна авторизація)   |
| GET    | `/users/:id`              | Публічний профіль користувача                |
| GET    | `/users/:userId/articles` | Статті, створені користувачем                |
| GET    | `/users/saved`            | Збережені статті поточного користувача       |
| POST   | `/saved`                  | Додати статтю в закладки `{ articleId }`     |
| DELETE | `/saved`                  | Прибрати статтю із закладок `{ articleId }`  |
| PATCH  | `/users/me`               | Оновити профіль `{ name?, email?, avatar? }` |
| PATCH  | `/users/me/avatar`        | Оновити аватарку (form-data, поле `avatar`)  |

### Articles

| Метод  | Шлях                   | Опис                                                                            |
| ------ | ---------------------- | ------------------------------------------------------------------------------- |
| GET    | `/articles`            | Список статей (пагінація, категорії, сортування)                                |
| GET    | `/articles/:articleId` | Одна стаття                                                                     |
| POST   | `/articles`            | Створити статтю (form-data: `photo`, `title`, `article`) — потрібна авторизація |
| PATCH  | `/articles/:articleId` | Оновити статтю — лише власник                                                   |
| DELETE | `/articles/:articleId` | Видалити статтю — лише власник                                                  |
| GET    | `/articles/categories`          | Список категорій: `popular`, `general`, `recommended`                           |

## Відомі обмеження

- Кукі виставлені з `secure: true, sameSite: 'none'` — не працюють по звичайному HTTP на `localhost`, потрібен HTTPS або тимчасове послаблення налаштувань для локальної розробки.

## Скрипти

| Команда         | Опис                               |
| --------------- | ---------------------------------- |
| `npm run dev`   | Запуск у режимі розробки (nodemon) |
| `npm run start` | Звичайний запуск                   |
