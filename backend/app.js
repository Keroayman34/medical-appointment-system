import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import authRoutes from "./Modules/Auth/auth.routes.js";
import doctorRoutes from "./Modules/Doctor/doctor.routes.js";
import patientRoutes from "./Modules/Patient/patient.routes.js";
import availabilityRoutes from "./Modules/Appointments/availability.routes.js";

const app = express();

app.use(express.json());

// Connect to database
dbConnection();

// Test route
app.get("/", (req, res) => {
  res.send("Medical Appointment System API is running...");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/availability", availabilityRoutes);
