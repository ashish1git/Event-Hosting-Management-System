# Event Hosting Management System (Admin Portal)

A high-fidelity Event Management System built with the MERN stack (MongoDB, Express, React, Node.js). This project features a premium, modern UI inspired by platforms like Luma, with support for dark mode, glassmorphism, and complex event configurations.

## 🚀 Features

### Frontend (Client)
- **High-Fidelity UI**: "Luma" inspired dark theme (`#121212`) with neon accents (Cyan, Pink, Purple).
- **Hero Section**: Interactive 3D-style landing page with video portals and floating elements using Framer Motion.
- **Admin Dashboard**: Overview of active events and stats.
- **Create Event Page**: Comprehensive form with:
  - Date/Time pickers with timezone support.
  - Location toggles (Offline vs Online).
  - Rich media previews (Cover Image).
  - Ticket management (Free vs Paid).
  - "Sky Mint" alternative theme retained in CSS variables.
- **Tech Stack**: React, Vite, Tailwind CSS v4, Framer Motion, Axios, Lucide React.

### Backend (Server)
- **RESTful API**: Built with Node.js and Express.
- **Database**: MongoDB with Mongoose for schema modeling.
- **Authentication**: Admin JWT (JSON Web Token) authentication.
- **Data Models**:
  - `Event`: Stores event details, capacity, pricing, and approval settings.
  - `Admin`: Handles secure admin credentials.
  - `Feedback`: Captures user ratings.
- **Security**: Password hashing (bcryptjs) and protected routes.

---

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (Local or Atlas URI)
- **Git**

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashish1git/Event-Hosting-Management-System.git
   cd Event-Hosting-Management-System
   ```

2. **Install Root Dependencies (Backend):**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *(Note: A default configuration is already set up for development)*

---

## 🏃‍♂️ Running the Application

This project is configured as a monorepo. You can run both the backend and frontend with a single command from the **root** folder:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: Connected to MongoDB Atlas (Jeagerists Cluster).

---

## 📂 Project Structure

```
d:\Event_M
├── config/             # Database connection logic
├── controllers/        # Route logic (Auth, Events)
├── middleware/         # Auth protection middleware
├── models/             # Mongoose Schemas (Admin, Event, Feedback)
├── routes/             # API Route definitions
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # HeroSection, CreateEvent, Navbar
│   │   └── index.css   # Tailwind v4 Theme Configuration
├── server.js           # Server entry point
└── package.json        # Root scripts and dependencies
```

## 🎨 Design Systems

This project implements two distinct design systems via CSS variables in `frontend/src/index.css`:

1.  **Luma Dark (Active)**:
    *   Background: `#121212`
    *   Accents: Cyan (`#00FFFF`), Pink (`#FF00CC`), Purple (`#8A2BE2`)
2.  **Sky Mint (Available)**:
    *   Background: `#F0F9FF`
    *   Accents: Sky Blue (`#0EA5E9`), Mint Green (`#10B981`)

---

## 📝 API Endpoints

### Admin
- `POST /api/admin/login` - Authenticate admin
- `POST /api/admin/register` - Register new admin

### Events
- `GET /api/admin/events` - Get all events
- `POST /api/admin/events` - Create a new event
- `GET /api/admin/events/:id` - Get specific event details
- `PUT /api/admin/events/:id` - Update an event
- `DELETE /api/admin/events/:id` - Delete an event
