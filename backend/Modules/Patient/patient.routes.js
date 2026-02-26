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

router.post("/", protect, allowRoles("patient"), createPatientProfile);

router.get("/me", protect, allowRoles("patient"), getMyPatientProfile);

router.patch(
  "/me",
  protect,
  allowRoles("patient"),
  validate(updatePatientProfileSchema),
  updateMyPatientProfile,
);

export default router;
