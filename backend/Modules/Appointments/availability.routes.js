import express from "express";
import {
  addAvailability,
  getDoctorAvailability,
  getMyAvailability,
  deleteAvailability,
} from "./availability.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { addAvailabilitySchema } from "./availability.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("doctor"),
  validate(addAvailabilitySchema),
  addAvailability,
);

router.get("/me", protect, allowRoles("doctor"), getMyAvailability);

router.delete("/:id", protect, allowRoles("doctor"), deleteAvailability);

router.get("/:doctorId", getDoctorAvailability);

export default router;
