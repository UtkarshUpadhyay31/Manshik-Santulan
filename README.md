# Manshik Santulan - Full Stack Mental Health Platform

AI-powered mental health & mind ease platform with React frontend, Node.js backend, and MongoDB database.

## 🎯 Project Overview

**मानसिक संतुलन (Manshik Santulan)** = Mind Balance & Ease

A modern, production-ready web application designed to help users track their mental health, understand emotional patterns, and receive AI-powered personalized recommendations for emotional well-being. **Focuses on privacy and accessibility—most core features work without needing an account.**

## 📁 Project Structure

```
Manshik Santulan/
├── backend/                  # Node.js + Express server
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   └── index.js         # Server entry point
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Reusable UI components & Modals
│   │   ├── pages/          # Page components (Dashboard, Help, Lists)
│   │   ├── services/       # API services (Axios)
│   │   ├── context/        # Zustand stores
│   │   └── App.jsx         # Routing & Core logic
│   ├── public/
│   │   └── audio/          # Calming audio assets
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (Local or Atlas)

### Backend Setup
1. `cd backend && npm install`
2. Configure `.env` (MONGODB_URI, PORT=5000)
3. `npm run dev`

### Frontend Setup
1. `cd frontend && npm install`
2. Configure `.env` (VITE_API_URL=http://localhost:5000/api)
3. `npm run dev`

## 📋 Core Features

### 🧘 Wellness Rituals
- **Mood Tracker**: Log your daily emotions with a refined slider and text reflection. Works anonymously using local storage.
- **Breathing Space**: Interactive 4-4-6 breathing exercise with **calming background audio**, visual ambient rings, and fade-in/out effects.
- **AI Coach**: Anonymous AI insights that notice patterns in your mood (mocked for privacy).

### 🤝 Professional Connect
- **Mentor Connect**: Browse and connect with verified personal development mentors.
- **Therapy Connect**: Access certified therapists and doctors for professional support.
- **Professional Profiles**: View detailed credentials, ratings, and connect with experts directly.

### 🆘 Help Now (Crisis Support)
- **Panic Mode**: Immediate 4-4-4-4 box breathing and grounding exercises.
- **Crisis Network**: 24/7 helpline contacts (Vandrevala Foundation, iCall, AASRA).
- **Grounding Rituals**: Guided 5-4-3-2-1 sensory exercises for instant calm.

### 📊 Personal Dashboard
- **Insights**: Stress trends over the last 7 days and mood distribution charts.
- **Suggestions**: Personalized wellness rituals based on your recent flow.
- **Privacy-First**: Dashboard data is stored locally for guests, ensuring no data leaves your browser unless you choose.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Modern glassmorphism & gradients)
- **Framer Motion** (Immersive animations & transitions)
- **Recharts** (Wellness visualization)
- **Lucide React** (Premium iconography)
- **Zustand** (Global state management)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **HTML5 Audio API** (Isolated audio logic with fade effects)

## 🎨 Design System

### Visual Aesthetic
- **Rich Aesthetics**: Vibrant gradients, dark modes, and soft blurs (glassmorphism).
- **Micro-Animations**: Subtle hover effects and layout transitions to make the app feel "alive".
- **Responsive**: Fully optimized for mobile, tablet, and desktop viewing.

## 📄 License

MIT License - Feel free to use this project for learning and production.

---

**Made with ❤️ for better mental health**
मानसिक संतुलन = Mind Balance & Ease

