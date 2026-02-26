import express from "express";
import {
  createPatientProfile,
  getMyPatientProfile,
  updateMyPatientProfile,
} from "./patient.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { updatePatientProfileSchema } from "./patient.validation.js";

const router = express.Router();

// Create patient profile (only for role = patient)
router.post("/", protect, allowRoles("patient"), createPatientProfile);

// Get my patient profile
router.get("/me", protect, allowRoles("patient"), getMyPatientProfile);

// Update my patient profile
router.patch(
  "/me",
  protect,
  allowRoles("patient"),
  validate(updatePatientProfileSchema),
  updateMyPatientProfile,
);

export default router;
