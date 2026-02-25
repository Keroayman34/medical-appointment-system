import express from "express";
import { config } from "./Config/env.js";
import { dbConnection } from "./Database/dbConnection.js";

// Routes
import authRoutes from "./Modules/Auth/auth.routes.js";
import doctorRoutes from "./Modules/Doctor/doctor.routes.js";
import patientRoutes from "./Modules/Patient/patient.routes.js";
import availabilityRoutes from "./Modules/Appointments/availability.routes.js";
import appointmentRoutes from "./Modules/Appointments/appointment.routes.js";
import specialtyRoutes from "./Modules/Specialties/specialty.routes.js";
import userRoutes from "./Modules/User/user.routes.js";

// Middlewares
import { globalErrorHandler } from "./Middlewares/error.middleware.js";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Connect to database
dbConnection();

// Test route
app.get("/", (req, res) => {
  res.send("Medical Appointment System API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/specialties", specialtyRoutes);

// Global Error Handler (MUST be last)
app.use(globalErrorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
