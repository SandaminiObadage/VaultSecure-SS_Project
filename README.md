VaultSecure-SS Project
🌟 Full-Stack Application

📖 Overview
VaultSecure-SS is a comprehensive full-stack application designed for secure, user-centric resource management. It features an intuitive frontend built with React and Vite, complemented by a robust backend powered by Node.js, Express, and MongoDB. The app also incorporates advanced security measures, including email verification, password reset capabilities, and reCAPTCHA protection.

🗂 Project Structure
auth-proj(SS)
├── .env
├── .gitignore
├── backend/
│   ├── controllers/
│   │   ├── auth_controller.js
│   │   └── resource.controllers.js
│   ├── db/
│   │   └── connectDB.js
│   ├── index.js
│   ├── mailtrap/
│   │   ├── emails.js
│   │   ├── emailTemplates.js
│   │   └── mailtrap.config.js
│   ├── middleware/
│   │   ├── morganMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── log.model.js
│   │   ├── user_model.js
│   │   └── ...
│   ├── routes/
│   │   └── resource.routes.js
│   ├── utils/
│   │   ├── generateTokenAndSetCookie.js
│   │   └── ...
│   ├── validators/
│   │   └── ...
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   ├── README.md
│   ├── src/
│   │   ├── components/
│   │   │   ├── FloatingShape.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── OAuth.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── Reaction.jsx
│   │   │   ├── ResourceDetail.jsx
│   │   │   ├── ResourceForm.jsx
│   │   │   └── ResourceList.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EmailVerificationPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── ResourcePage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── tailwind.config.js
│   │   ├── vite.config.js
│   │   └── firebase.js
├── package.json
├── README.md

🚀 Installation Guide
Backend Setup:

Navigate to the backend directory:
cd backend

Install the dependencies:
npm install

Set up environment variables:
Create a .env file in the backend directory and add your environment variables:
touch .env

Start the backend server:
npm run dev
Frontend Setup

Navigate to the frontend directory:
cd frontend

Install the dependencies:
npm install

Set up environment variables:
Create a .env file in the frontend directory and add your environment variables:
touch .env

Start the frontend development server:
npm run dev

💻 Usage
To access the application:

Frontend: Open http://localhost:5173 in your browser.
Backend: The backend server will run at http://localhost:5000.

✨ Key Features
User Authentication & Authorization: Supports secure sign-up and login flows.
Resource Management: Full CRUD (Create, Read, Update, Delete) operations for resources.
Comments & Reactions: Allows users to interact with resources.
Email Verification & Password Reset: Enhanced account security with email-based verification and password recovery.
reCAPTCHA Protection: Additional layer of security against spam and bots.

🛠 Technology Stack
Frontend: React, Vite, Tailwind CSS, Zustand, Framer Motion
Backend: Node.js, Express, MongoDB, Mongoose, JWT, Mailtrap, Firebase
