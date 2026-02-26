import { Router } from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointmentsByView,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
  addConsultationNotes,
  getAllAppointments,
} from "./appointment.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import {
  bookAppointmentSchema,
  consultationNotesSchema,
  rescheduleAppointmentSchema,
  updateStatusSchema,
} from "./appointment.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  allowRoles("patient"),
  validate(bookAppointmentSchema),
  bookAppointment,
);

router.get("/my", protect, allowRoles("patient", "doctor"), getMyAppointments);

router.get(
  "/doctor",
  protect,
  allowRoles("doctor"),
  getDoctorAppointmentsByView,
);

router.patch("/:id/cancel", protect, allowRoles("patient"), cancelAppointment);

router.patch(
  "/:id/reschedule",
  protect,
  allowRoles("patient"),
  validate(rescheduleAppointmentSchema),
  rescheduleAppointment,
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("doctor"),
  validate(updateStatusSchema),
  updateAppointmentStatus,
);

router.patch(
  "/:id/consultation-notes",
  protect,
  allowRoles("doctor"),
  validate(consultationNotesSchema),
  addConsultationNotes,
);

router.get("/", protect, allowRoles("admin"), getAllAppointments);

export default router;
