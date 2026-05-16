# NEDAAS

A comprehensive full-stack web application designed for managing academic conferences, publications, and user roles in a collaborative research environment. Built with modern web technologies to facilitate seamless interaction between directors, advisors, leads, members, and administrators.

## Link https://nedaas.org/

## 🚀 Features

### User Management & Authentication
- **Role-based Access Control**: Support for multiple user roles including Director, Advisor, Lead, Member, and Admin
- **Firebase Authentication**: Secure authentication and authorization using Firebase
- **Protected Routes**: Role-specific dashboards and access controls

### Conference Management
- **Conference Creation & Management**: Tools for directors to organize and manage conferences
- **Calendar Integration**: Director calendar events for scheduling and planning
- **Publication Tracking**: Comprehensive publication management system

### Publication System
- **Publication Repository**: Centralized storage and management of research publications
- **Author Management**: Track authors and their contributions
- **Lead Publication Oversight**: Specialized routes for lead researchers

### Administrative Tools
- **Admin Dashboard**: Full administrative control over users, conferences, and publications
- **Analytics & Reporting**: Insights into platform usage and activity
- **System Configuration**: Backend configuration for MongoDB and Firebase integration

### User Experience
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Smooth Animations**: Enhanced UI with Framer Motion
- **Fast Loading**: Optimized with Vite build system
- **Intuitive Navigation**: Clean, professional interface with React Router

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Firebase Admin SDK** - Server-side Firebase integration
- **Security**: Helmet, CORS, Rate Limiting, MongoDB Sanitization

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Firebase** - Client-side authentication and storage
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Deployment
- **Vercel** - Frontend and backend deployment
- **Firebase Hosting** - Alternative hosting option

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project

## 🔧 Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory with the following variables:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nedaas?retryWrites=true&w=majority
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   ```

   For detailed Firebase setup instructions, refer to `backend/SETUP.md`.

4. **Start the backend server:**
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_API_BASE_URL=http://localhost:5000/api  # For local development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

## 🚀 Usage

1. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

2. **User Roles and Dashboards:**
   - **Director**: Conference management and calendar events
   - **Advisor**: Guidance and oversight
   - **Lead**: Publication leadership
   - **Member**: Research contributions
   - **Admin**: Full system administration

3. **Key Workflows:**
   - Register/Login with Firebase authentication
   - Access role-specific dashboard
   - Manage conferences, publications, and users based on permissions

## 📁 Project Structure

```
NEDAAS-React/
├── backend/
│   ├── middleware/
│   ├── models/
│   │   ├── Author.js
│   │   ├── Conference.js
│   │   ├── DirectorCalendarEvent.js
│   │   ├── Publication.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── directorRoutes.js
│   │   ├── leadPublicationRoutes.js
│   │   ├── leadRoutes.js
│   │   └── publicationRoutes.js
│   ├── firebaseAdmin.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── Auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── dashboards/
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

## 🔄 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting (Alternative)
1. Build the frontend: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Initialize Firebase: `firebase init`
4. Deploy: `firebase deploy`

---

**Note:** Ensure all environment variables are properly configured before deployment. Refer to `backend/SETUP.md` for detailed Firebase and MongoDB setup instructions.
