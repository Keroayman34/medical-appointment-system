import { Router } from "express";
import {
  createDoctorProfile,
  getMyDoctorProfile,
} from "./doctor.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

// Create doctor profile (only doctor)
router.post("/", protect, allowRoles("doctor"), createDoctorProfile);

// Get my doctor profile
router.get("/me", protect, allowRoles("doctor"), getMyDoctorProfile);

export default router;
