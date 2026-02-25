import { Router } from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAllAppointments,
} from "./appointment.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import {
  bookAppointmentSchema,
  updateStatusSchema,
} from "./appointment.validation.js";

const router = Router();

// Patient: book appointment
router.post(
  "/",
  protect,
  allowRoles("patient"),
  validate(bookAppointmentSchema),
  bookAppointment,
);

// Patient or Doctor: get my appointments
router.get("/my", protect, allowRoles("patient", "doctor"), getMyAppointments);

// Patient: cancel appointment
router.patch("/:id/cancel", protect, allowRoles("patient"), cancelAppointment);

// Doctor: update appointment status
router.patch(
  "/:id/status",
  protect,
  allowRoles("doctor"),
  validate(updateStatusSchema),
  updateAppointmentStatus,
);

// Admin: get all appointments
router.get("/", protect, allowRoles("admin"), getAllAppointments);

export default router;
