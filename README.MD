# 📋 Team Task Manager

A full-stack web app to help teams manage tasks and projects — create tasks, assign them to team members, and track progress all in one place.
where you can discuss with your team members on some specific topics

---

## INFO
**login as admin**
   - email : admin@gmail.com
  -  password : 123456

---

---

## ✨ Features

- 🔐 **Auth** — Register, login, and JWT-protected routes
- 📊 **Dashboard** — Overview of tasks and project stats
- 📁 **Project Management** — Organize tasks under projects
- ✅ **Task Management** — Create, assign, update, and delete tasks
- 👥 **User Management** — Create users and view tasks by user
- 🏷️ **Priority & Status** — Tag tasks as Low / Medium / High and track Pending / In Progress / Done
- 💬 **Discussions** — You can create an issue or problem and post, then team member can reply and like to your post.
- 👥 **RBAC** — Role based access control, there are 3 types of user, Superadmin, Admin, and Member.
- 💳 **Subscriptions** — Payment integration for plans, there are three types of plan Free, Basic and Pro, Each plan have some specific limitation to add users, task, projects. 

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

# RAZORPAY SECRET
KEY_SECRET=
KEY_ID=
```

### 3. Setup the Server

```bash
cd server
npm install
nodemon or npm run dev
```

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL = http://localhost:5000 or deployed url
VITE_RAZORPAY_KEY_ID =
VITE_RAZORPAY_API = 
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
│       ├── hooks/ 
│       ├── layouts/      # Page layouts
│       ├── services/     # Axios API calls
│       ├── contexts/     # React context (auth, etc.)
│       └──.env
│
└── server/               # Express backend
    ├── models/           # Mongoose schemas (User, Task, Project)
    ├── controllers/      # Route logic
    ├── routes/           # API routes
    ├── middlewares/      # Auth middleware
    ├── config/           # DB connection
    └── .env 
```

---

## 👤 Author
***SURAJ KUMAR***
