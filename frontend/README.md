<div align="center">

# 📝 MERN Summarizer
### *AI-Powered Text Summarization Web App*

> Paste any text and get a clean, concise summary instantly.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-4CAF50?style=for-the-badge)](https://mern-summarizer-three.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Vishrutha2410-181717?style=for-the-badge&logo=github)](https://github.com/Vishrutha2410/mern-summarizer)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 About

**MERN Summarizer** is a full-stack web application that uses AI to summarize long texts into short, readable summaries. Built with the MERN stack — MongoDB, Express.js, React, and Node.js — it provides a clean interface for pasting text and receiving an instant AI-generated summary.

---

## ✨ Features

- 📋 **Paste & Summarize** — Paste any text and get a summary instantly
- 🤖 **AI-Powered** — Uses OpenAI API for intelligent summarization
- 💾 **Save Summaries** — Summaries stored in MongoDB for future reference
- 🔐 **JWT Authentication** — Secure login and protected routes
- 📱 **Responsive UI** — Works on mobile and desktop
- ⚡ **Fast** — Vite-powered frontend for lightning-fast loading

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT + bcryptjs |
| **AI** | OpenAI API |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure
```
mern-summarizer/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas
- OpenAI API key → https://platform.openai.com

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Vishrutha2410/mern-summarizer.git
cd mern-summarizer
```

### 2️⃣ Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/summarizer
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=sk-your_openai_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```
✅ Server runs at `http://localhost:5000`

### 3️⃣ Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
✅ App runs at `http://localhost:5173`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Summarizer
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/summarize` | Summarize input text | ✅ |
| GET | `/api/summaries` | Get all saved summaries | ✅ |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
```
Set environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend.onrender.com
```

### Backend → Render
Set environment variables in Render dashboard:
```
MONGO_URI       = your MongoDB Atlas connection string
JWT_SECRET      = your JWT secret
OPENAI_API_KEY  = your OpenAI API key
NODE_ENV        = production
PORT            = 5000
FRONTEND_URL    = https://your-app.vercel.app
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with 💚 by [Vishrutha](https://github.com/Vishrutha2410) using the MERN stack

⭐ Star this repo if you found it helpful!

</div>