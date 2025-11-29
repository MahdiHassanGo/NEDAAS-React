# NEDAAS - Full Stack Application

A complete full-stack application for NEDAAS Lab with React frontend and Node.js backend.

## Project Structure

```
nedaas-app/
  backend/          # Node.js + Express + MongoDB + Firebase Admin
  frontend/         # React + Vite + Tailwind CSS
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
FIREBASE_PROJECT_ID=nedaas-bf431
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Get your MongoDB Atlas connection string from your MongoDB Atlas dashboard
- Get Firebase Admin credentials from Firebase Console → Project Settings → Service accounts → "Generate new private key"

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

- **Frontend:**
  - React with Vite for fast development
  - Tailwind CSS for styling
  - React Router for navigation
  - Firebase Authentication (email/password + Google)
  - Role-based protected routes
  - Responsive design

- **Backend:**
  - Express.js REST API
  - MongoDB with Mongoose
  - Firebase Admin SDK for token verification
  - User role management

## Routes

### Frontend Routes
- `/` - Home page with all sections
- `/login` - Login page
- `/dashboard/director` - Director dashboard (protected)
- `/dashboard/advisor` - Advisor dashboard (protected)
- `/dashboard/lead` - Lead dashboard (protected)
- `/dashboard/member` - Member dashboard (protected)
- `/dashboard/admin` - Admin dashboard (protected)

### Backend API
- `GET /` - Health check
- `POST /api/auth/login` - Authenticate user and return role

## User Roles

- `director` - Lab Director
- `advisor` - Research Advisor
- `lead` - Team Lead
- `member` - Lab Member (default)
- `admin` - System Administrator

## Image Assets

Place all team member and lab images in the `frontend/public/Images/` directory. The following images are referenced in the code:

- `NEDAAS 3.0-01.png` - Lab logo
- `Brain.png` - Hero section image
- `Leader.png` - Lab Director image
- `Tahsin.png` - Deputy Director image
- `Advisor1.png` - Advisor 1 image
- `advisor2.jpg` - Advisor 2 image
- `Sunipun.png` - Team Lead image
- `SIFAT.jpg` - Team Lead image
- `MOYNUL.png` - Team Lead image
- `PP2.jpg` - Team Lead image
- `tamim.png` - Team Lead image
- `Jihad.png` - Team Lead image
- `Asif.png` - HRM image
- `passport-size_photo.jpg` - Placeholder for Designer and IT roles

## Notes

- Make sure to add all team member images to `frontend/public/Images/` directory
- The backend `.env` file should never be committed to version control
- Firebase Admin credentials must be kept secure
- Copy `backend/.env.example` to `backend/.env` and fill in your actual credentials

