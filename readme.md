# 📦 Проект: Fullstack Blog

> Полноценный фуллстек блог с поддержкой постов, авторизацией, ролями, панелью администратора и базой данных MongoDB.

---

## 🔹 Описание проекта

**Fullstack Blog** — это учебный проект, который реализует современные практики веб-разработки:

- Разделение на **frontend** и **backend**
- Backend на **Node.js + Express**
- База данных: **MongoDB**
- Авторизация и регистрация с JWT
- Поддержка **ролей** (пользователь, админ)
- REST API для постов и пользователей

---

## 🔹 Стек технологий

**Frontend**:
- HTML5, SCSS
- JavaScript (ESModules)
- Axios

**Backend**:
- Node.js
- Express.js
- MongoDB, Mongoose
- JWT (авторизация)
- dotenv

> 📌 Код логично разделён: бизнес-логика отдельно от рендеринга.

---

## 🔹 Установка и запуск

```bash
# Установка зависимостей backend
cd backend
npm install

# Установка зависимостей frontend (если есть отдельный dev-сервер)
cd frontend
npm install

# Запуск backend
cd backend
npm run dev

# Запуск frontend
св frontend
npm run dev