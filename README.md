# Hospital Management System (MERN Stack)

A complete full-stack web application built using the MERN stack with Role-Based Access Control.

## Features

- **Authentication & Authorization**: Secure login with JWT tokens and role-based route protection.
- **Roles**: 
  - **Admin**: Can manage all staff, view all patients and appointments.
  - **Doctor**: Can view assigned patients, add diagnoses and prescriptions.
  - **Nurse**: Can update patient vitals and add nursing notes.
- **Modern UI**: Built with React, Vite, Tailwind CSS (v4), and Lucide React icons. Features a beautiful glassmorphism login page and clean dashboard.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally on port 27017

### 1. Backend Setup

Open a terminal and navigate to the `backend` folder:
```bash
cd backend
```

Install dependencies if you haven't already:
```bash
npm install
```

Seed the database with default users and dummy data:
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```
*The server will run on http://localhost:5000*

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

### 3. Demo Accounts

You can log in with the following seeded accounts:

- **Admin**: `admin@hospital.com` | Password: `password`
- **Doctor**: `doctor@hospital.com` | Password: `password`
- **Nurse**: `nurse@hospital.com` | Password: `password`
