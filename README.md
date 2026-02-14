# Manshik Santulan - Full Stack Mental Health Platform

AI-powered mental health & mind ease platform with React frontend, Node.js backend, and MongoDB database.

## 🎯 Project Overview

**मानसिक संतुलन (Manshik Santulan)** = Mind Balance & Ease

A modern, production-ready web application designed to help users track their mental health, understand emotional patterns, and receive AI-powered personalized recommendations for emotional well-being. **Focuses on privacy and accessibility—core features work for guests, with enhanced personalization for registered users.**

## 📁 Project Structure

```
Manshik Santulan/
├── backend/                  # Node.js + Express server
│   ├── src/
│   │   ├── controllers/      # Business logic (Auth, AI, Mood, Admin)
│   │   ├── middleware/       # Auth & Error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   └── index.js         # Server entry point
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Reusable UI components & Modals
│   │   ├── pages/          # Page components (Dashboard, Auth, Admin)
│   │   ├── services/       # API services (Axios)
│   │   ├── context/        # Auth & State Context
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
- Google Gemini API Key (for AI Coach)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file in the `backend` directory with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file in the `frontend` directory with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev`

## 📋 Core Features

### 🔐 Authentication & User Profiles
- **Secure Sign-up/Login**: Email & password authentication using JWT and bcrypt.
- **User Dashboard**: Personalized dashboard with mood history and profile management.
- **Role-Based Access**: Separate interfaces for Users, Professionals (Therapists/Mentors), and Admins.

### 🧘 Wellness Rituals
- **Mood Tracker**: Log your daily emotions with a refined slider and text reflection.
- **Breathing Space**: Interactive 4-4-6 breathing exercise with **calming background audio**, visual ambient rings, and fade-in/out effects.
- **AI Coach**: Powered by **Google Gemini**, offering personalized mental health insights and conversation based on your mood patterns.

### 🤝 Professional Connect
- **Mentor Connect**: Browse and connect with verified personal development mentors.
- **Therapy Connect**: Access certified therapists and doctors for professional support.
- **Professional Profiles**: View detailed credentials, ratings, and book sessions.
- **Session Management**: Dedicated session pages for managing appointments.

### 🆘 Help Now (Crisis Support)
- **Panic Mode**: Immediate 4-4-4-4 box breathing and grounding exercises.
- **Crisis Network**: 24/7 helpline contacts (Vandrevala Foundation, iCall, AASRA).
- **Grounding Rituals**: Guided 5-4-3-2-1 sensory exercises for instant calm.

### �️ Admin Panel
- **Dashboard**: Overview of platform statistics (users, moods logged, sessions).
- **User Management**: Manage user accounts and roles.
- **Content Management**: Tools for managing blog posts and resources.
- **Analytics**: Reports on platform usage and mental health trends.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Modern glassmorphism & gradients)
- **Framer Motion** (Immersive animations & transitions)
- **Recharts** (Wellness visualization)
- **Lucide React** (Premium iconography)
- **Zustand** (Global state management)
- **Axios** (API requests)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens) for Authentication
- **Bcrypt** for Password Hashing
- **Google Generative AI** (Gemini) for AI Coach
- **Socket.io** (Real-time features)

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
