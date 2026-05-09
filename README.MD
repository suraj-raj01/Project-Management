# 📋 Team Task Manager

A full-stack web app to help teams manage tasks and projects — create tasks, assign them to team members, and track progress all in one place.

---

## INFO
**login as admin**
   email : surajk@gmail.com
   password : 123456

---

---

## ✨ Features

- 🔐 **Auth** — Register, login, and JWT-protected routes
- 📊 **Dashboard** — Overview of tasks and project stats
- ✅ **Task Management** — Create, assign, update, and delete tasks
- 📁 **Project Management** — Organize tasks under projects
- 👥 **User Management** — Create users and view tasks by user
- 🏷️ **Priority & Status** — Tag tasks as Low / Medium / High and track Pending / In Progress / Done

---

## 🛠️ Tech Stack

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Frontend | React 19, TypeScript, Tailwind CSS, Vite  |
| Backend  | Node.js, Express 5                        |
| Database | MongoDB (Mongoose)                        |
| Auth     | JWT + bcrypt                              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup the client

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

The app will be running at **http://localhost:5173** 🎉

---

## 📂 Project Structure

```
team-task-manager/
├── client/               # React frontend
│   └── src/
│       ├── pages/        # Dashboard, Tasks, Projects, Users...
│       ├── components/   # Reusable UI components
│       ├── layouts/      # Page layouts
│       ├── services/     # Axios API calls
│       └── contexts/     # React context (auth, etc.)
│
└── server/               # Express backend
    ├── models/           # Mongoose schemas (User, Task, Project)
    ├── controllers/      # Route logic
    ├── routes/           # API routes
    ├── middlewares/      # Auth middleware
    └── config/           # DB connection
```

---

## 👤 Author

**SURAJ KUMAR**
