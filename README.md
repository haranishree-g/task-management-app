# ⚡ TaskFlow Pro - Full-Stack Real-Time Task Management App

TaskFlow Pro is a modern, responsive full-stack task management web application built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, **SQLite**, and **Socket.io**.

It supports complete task CRUD operations, JWT user authentication, Kanban board with **drag-and-drop** column transfers, list view, stats analytics dashboard, and real-time multi-tab WebSocket synchronization.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**: Secure registration, login, password hashing (`bcryptjs`), and JWT session tokens.
- ⚡ **Real-Time Live Sync (WebSockets)**: Powered by Socket.io for instant updates across connected devices and tabs.
- 📋 **Kanban Board View**: Drag-and-drop task cards between `To Do`, `In Progress`, and `Completed` columns.
- 📑 **List View**: Sortable tabular view with quick checkbox completion toggles.
- 📊 **Analytics Dashboard**: Live completion percentage progress bar, task status breakdown, and urgent task metrics.
- 🔍 **Filtering & Search**: Real-time keyword search, status filtering, priority level, category, and custom sorting.
- 🎨 **Responsive Dark Mode UI**: Built with Tailwind CSS and Lucide react icons.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP & Sockets**: Axios, Socket.io-client

### Backend
- **Server**: Node.js, Express
- **Database**: SQLite (`sqlite3` with promises)
- **Real-Time**: Socket.io
- **Auth & Security**: JWT (`jsonwebtoken`), `bcryptjs`, CORS

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd task-management-app
```

### 2. Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 3. Start Frontend Client (In a new terminal window)
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch current user profile | Yes |
| `GET` | `/api/tasks` | Fetch tasks (with search/filter/sort) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update task details / status | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |
| `GET` | `/api/tasks/stats` | Fetch task analytics & counters | Yes |

---

## 📄 License
Distributed under the MIT License.
