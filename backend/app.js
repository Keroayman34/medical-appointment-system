import express from "express";
import cors from "cors";
import { config } from "./Config/env.js";
import { dbConnection } from "./Database/dbConnection.js";

import authRoutes from "./Modules/Auth/auth.routes.js";
import doctorRoutes from "./Modules/Doctor/doctor.routes.js";
import patientRoutes from "./Modules/Patient/patient.routes.js";
import availabilityRoutes from "./Modules/Appointments/availability.routes.js";
import appointmentRoutes from "./Modules/Appointments/appointment.routes.js";
import specialtyRoutes from "./Modules/Specialties/specialty.routes.js";
import userRoutes from "./Modules/User/user.routes.js";
import notificationRoutes from "./Modules/Notifications/notification.routes.js";

import { globalErrorHandler } from "./Middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedPatterns = [
        /^http:\/\/localhost:(5173|5174)$/,
        /^http:\/\/127\.0\.0\.1:(5173|5174)$/,
        /^http:\/\/192\.168\.\d+\.\d+:(5173|5174)$/,
      ];

      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
      return callback(null, isAllowed);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

dbConnection();

app.get("/", (req, res) => {
  res.send("Medical Appointment System API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(globalErrorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
