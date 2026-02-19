import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import authRoutes from "./Modules/Auth/auth.routes.js";
import doctorRoutes from "./Modules/Doctor/doctor.routes.js";
import patientRoutes from "./Modules/Patient/patient.routes.js";
import availabilityRoutes from "./Modules/Appointments/availability.routes.js";
import userModel from "./Database/Models/user.model.js";
import userRouter from "./Modules/User/user.routes.js";
const app = express();

app.use(express.json());

dbConnection();
userModel;
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Medical Appointment System API is running...");
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/availability", availabilityRoutes);
