# Manshik Santulan - Frontend

Modern React + Vite frontend for the AI-powered mental health platform.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Logo.jsx
│   │   ├── UI.jsx           # Button, Input, Card, Container
│   │   ├── Toast.jsx        # Notifications
│   │   └── modals/          # Breathing, Mood, AI Coach modals
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx  # Main hub with new professional sections
│   │   ├── MentorList.jsx   # [NEW] Mentor discovery & filtering
│   │   ├── TherapistList.jsx# [NEW] Therapy type selection & listing
│   │   ├── ProfessionalProfile.jsx # [NEW] Detailed bio & booking
│   │   ├── SessionPage.jsx  # [NEW] Real-time chat & mock call UI
│   │   ├── Dashboard.jsx
│   │   └── HelpPage.jsx
│   ├── context/
│   │   └── store.js         # Zustand stores
│   ├── styles/
│   │   └── index.css        # Global styles + Tailwind
│   ├── utils/               # Guest mode & helper functions
│   ├── App.jsx              # Routing configuration
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── ...
```

## Installation & Setup

1. Install Dependencies:
```bash
npm install
```

2. Environment Setup:
```bash
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
```

3. Start Development Server:
```bash
npm run dev
```

## Principal Features

### 1. Mentor Connect (Guidance)
- **Discovery**: Filter mentors by category (Career, Life, Relationship, Wellness) and language.
- **Profiles**: View detailed professional bios, years of experience, and user ratings.
- **Booking**: Interactive calendar for booking 1-on-1 calls.
- **Chat**: Real-time communication with mentors using Socket.io.

### 2. Therapy Connect (Professional Support)
- **Specializations**: Targeted support for Anxiety, Depression, Stress, and Sleep Disorders.
- **Verified Professionals**: Consult with certified doctors and clinical psychologists.
- **Secure Consultations**: Privacy-focused consultation sessions with professional disclaimers.
- **Communication Hub**: Integrated audio call and secure messaging interface.

### 3. Mental Wellness Suite
- **Mood Tracking**: Deep emotional tracking with stress level analysis.
- **AI Feedback**: Instant personalized insights based on your mood.
- **Breathing Space**: Guided box-breathing exercises for immediate calm.
- **Interactive Dashboard**: Visual trends and history ribbon of your emotional well-being.

## Technologies Used
- **React 18** & **Vite**
- **Tailwind CSS** (Modern glassmorphism UI)
- **Framer Motion** (Smooth transitions & micro-animations)
- **Socket.io-client** (Real-time updates)
- **Lucide React** (Premium iconography)
- **Zustand** (State management)
- **Axios** (HTTP requests)

## Navigation & Routing
- `/`: Main Landing Page
- `/mentors`: Mentor list with category filters
- `/therapists`: Professional therapy specialization list
- `/professional/:id`: Professional profile & booking
- `/session/:id`: Active chat/consultation session
- `/dashboard`: Mood history & wellness analytics

## Build for Production
```bash
npm run build
```
Output will be in the `dist/` directory.
