
# 🏥 Medical Appointment System

A full-stack medical appointment management platform designed to streamline the interaction between patients and doctors through secure authentication, profile management, and intelligent scheduling.

---

## 🚀 Overview

This project is a scalable healthcare booking system that enables patients to book, manage, and track appointments with doctors while ensuring no scheduling conflicts. The system is built with a modular backend architecture using Node.js and integrates seamlessly with a modern React frontend.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Secure user registration and login using **JWT**
* Role-based access control (**Admin / Doctor / Patient**)
* Protected API routes using middleware

---

### 👨‍⚕️ Doctor & 🧑 Patient Profiles

* Create and manage profiles based on user roles
* Each user is linked to exactly one profile (Doctor or Patient)
* Clean separation of concerns using relational references

---

### 📅 Appointment Management (Core Module)

* Book appointments with doctors
* Prevent double booking using database-level constraints
* Cancel and reschedule appointments
* Doctor dashboard for managing appointments
* Update appointment status (pending / confirmed / completed / cancelled)
* Add consultation notes after appointments

---

### ⏱️ Availability System

* Doctors can define available time slots
* Ensures bookings align with doctor schedules

---

### 📧 Email Notifications

* Automated email alerts for:

  * Booking confirmations
  * Cancellations
  * Rescheduling updates

---

### ✅ Data Validation & Error Handling

* Request validation using **Joi**
* Centralized error handling middleware
* Clean and consistent API responses

---

## 🛠️ Tech Stack

### Backend

* **Node.js** – Runtime environment
* **Express.js** – REST API framework
* **MongoDB** – NoSQL database
* **Mongoose** – ODM for schema and data modeling
* **JWT (jsonwebtoken)** – Authentication
* **bcrypt** – Password hashing
* **Joi** – Input validation
* **Nodemailer** – Email service

---

### Frontend

* **React.js** – UI framework
* **Vite** – Fast build tool
* **Tailwind CSS** – Utility-first styling

---

## 📁 Project Structure

```
medical-appointment-system-main
│
├── backend
│   ├── app.js
│   ├── Config
│   ├── Database
│   │   └── Models
│   ├── Middlewares
│   ├── Modules
│   │   ├── Auth
│   │   ├── Doctor
│   │   ├── Patient
│   │   ├── Appointments
│   │   └── User
│   ├── Utils
│   └── package.json
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md
```

---

## 🧠 System Architecture

```
User
 │
 ├── Doctor Profile
 │       │
 │       └── Availability
 │
 ├── Patient Profile
 │
 └── Appointment
         │
         ├── Doctor
         ├── Patient
         ├── Date & Time
         └── Status
```

---

## 🔌 API Endpoints (Core)

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

### Doctor

```
POST /api/doctors
GET  /api/doctors/me
```

---

### Patient

```
POST /api/patients
GET  /api/patients/me
```

---

### Appointments

```
POST   /api/appointments
GET    /api/appointments/my
GET    /api/appointments/doctor
PATCH  /api/appointments/:id/cancel
PATCH  /api/appointments/:id/reschedule
PATCH  /api/appointments/:id/status
PATCH  /api/appointments/:id/notes
GET    /api/appointments
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd medical-appointment-system-main
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Access the Application

* Backend → [http://localhost:5000](http://localhost:5000)
* Frontend → [http://localhost:5173](http://localhost:5173)

---

## 🔐 Security

* JWT-based authentication
* Role-based authorization
* Password hashing with bcrypt
* Input validation with Joi

---

## 🎯 Key Design Decisions

### Why MongoDB?

* Flexible schema for evolving data models
* High performance for read/write operations
* Ideal for RESTful API architecture

---

### Why Mongoose?

* Schema enforcement
* Data validation
* Built-in support for relationships (populate)

---

### Why JWT?

* Stateless authentication
* Scalable for distributed systems
* Easy integration with frontend clients

---

### Why Express.js?

* Lightweight and fast
* Minimal setup for REST APIs
* Strong middleware ecosystem

---

## 📊 Performance Considerations

* Prevented double booking using compound indexes
* Optimized queries with Mongoose
* Centralized error handling for maintainability

---

## 👨‍💻 Contribution & Role

### Backend Developer (Node.js)

Responsible for:

* Designing RESTful APIs
* Implementing authentication & authorization
* Building Doctor & Patient profile systems
* Developing the Appointment management module (core system)
* Designing database models and relationships
* Implementing validation and error handling
* Integrating email notification system

---

## 🚀 Future Enhancements

* Online payment integration
* Real-time notifications (WebSockets)
* Video consultation support
* Admin dashboard with analytics
* Mobile application

---

## 📄 License

This project is open-source and available under the MIT License.

---

## ⭐ Final Note

This project demonstrates a real-world scalable backend system with clean architecture, modular design, and secure API implementation suitable for production-level applications.

---

🔥 لو حابب تزودها كمان Level أعلى (GitHub Pro):

* Badges (build, license, tech icons)
* API docs بـ Swagger
* صور UI

قولّي وأنا أعمل لك Version أقوى كمان 💪
