# 📝 Todo App Backend

A Node.js + Express + MongoDB backend for a Todo application with JWT authentication, role-based access (User/Admin), and CRUD operations for todos.

## 🌐 Live Deployment
Frontend (Live)
Link: https://todo-frontend-plum-chi.vercel.app/

## 🚀 Features

-- User authentication (Register / Login)

-- JWT-based authorization

-- Role-based access control (user, admin)

-- CRUD operations for todos

-- Admin dashboard APIs (users, todos, stats)

-- Secure password hashing

-- Centralized error handling

-- CORS-enabled for frontend deployment

## 🛠️ Tech Stack

-- Node.js
-- Express.js
-- MongoDB (Mongoose)
-- JWT (Authentication)
-- bcrypt
-- CORS
-- Cookie Parser

### 📦 Environment Variables

Create a .env file in the root directory and add:

MONGODB=mongodb+srv:..........
PORT=5000
JWT_SECRET=e10os.............
JWT_EXPIRE=7d
