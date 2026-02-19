import express from "express";
import {
  createPatientProfile,
  getMyPatientProfile,
} from "./patient.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = express.Router();

// Create patient profile (only for role = patient)
router.post("/", protect, allowRoles("patient"), createPatientProfile);

// Get my patient profile
router.get("/me", protect, allowRoles("patient"), getMyPatientProfile);

export default router;
