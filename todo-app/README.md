# 📋 Todo App — Full-Stack Next.js + MongoDB

A secure, modern to-do application built with:
- **Frontend**: Next.js App Router (React Server & Client Components)
- **Backend**: Next.js API Routes (`/api/auth`, `/api/tasks`)
- **Authentication**: JWT + HTTP-only cookies
- **Database**: MongoDB (via Mongoose)

## ✅ Features
- User registration & login with email/password
- Create, toggle status, and delete tasks
- Protected dashboard (auth required)
- Secure logout (cookie clearing + redirect)
- TypeScript type safety (including `ObjectId` handling)

## ⚙️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Aishasiddiqui97/INTERNSHIP-TASKS-Todo-App.git
   cd INTERNSHIP-TASKS-Todo-App/todo-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/todo-app
   JWT_SECRET=your-super-secret-jwt-key
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
   → Open [http://localhost:3000](http://localhost:3000)

## 🌐 Routes
- `/` → Landing page
- `/auth/login` → Login form
- `/auth/register` → Sign-up form
- `/dashboard` → Protected task list
- `/auth/logout` → Logout (DELETE route)

---
Built with ❤️ by Aisha A. Siddiqui