# Manshik Santulan - Backend

Backend API server for the AI-powered mental health platform.

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Business logic (professionals, auth, mood)
│   ├── middleware/         # Express middleware (auth, error handling)
│   ├── models/            # MongoDB Mongoose schemas (Mentor, Doctor, etc.)
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── seed.js            # Initial data seeding script
│   └── index.js           # Server entry point + Socket.io setup
├── .env                   # Environment variables
├── package.json
├── README.md
└── ...
```

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and other settings (see Environment Variables section)

5. Seed initial data (Mentors & Doctors):
```bash
node src/seed.js
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /preferences/dark-mode` - Toggle dark mode (protected)

### Mood Tracking (`/api/mood`)
- `POST /entry` - Create mood entry (protected)
- `GET /today` - Get today's mood (protected)
- `GET /history` - Get mood history last 30 days (protected)
- `POST /analyze` - Analyze emotion from text (protected)
- `GET /suggestions` - Get AI suggestions (protected)
- `PUT /suggestions/:id/complete` - Mark suggestion as done (protected)

### Professionals & Consultations (`/api/professionals`)
- `GET /mentors` - Get all mentors (accepts `category`, `language` filters)
- `GET /mentors/:id` - Get mentor by ID
- `GET /doctors` - Get all doctors (accepts `therapyType` filter)
- `GET /doctors/:id` - Get doctor by ID
- `POST /book-appointment` - Book a session
- `POST /chat/init` - Initialize/get chat session
- `POST /chat/message` - Save chat message

### Admin (`/api/admin`)
- `GET /analytics` - Dashboard analytics (admin only)
- `GET /mood-data` - Anonymous mood trends (admin only)
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user details (admin only)
- `PUT /users/:id/deactivate` - Deactivate user (admin only)
- `PUT /users/:id/reactivate` - Reactivate user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

## Real-time Capabilities

The backend uses **Socket.io** for real-time features:
- **Join Chat**: `join-chat` event with `chatId`.
- **Messaging**: `send-message` and `receive-message` events for instant communication.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security headers

## Environment Variables

```
MONGODB_URI=mongodb://127.0.0.1:27017/manshik_santulan
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Security & Privacy
- JWT-based authentication for sensitive routes.
- BCrypt hashing for user passwords.
- Role-based Access Control (User / Admin).
- Encrypted-style communication logs.
