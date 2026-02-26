import express from "express";
import {
  createDoctorProfile,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  discoverDoctors,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "./doctor.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("doctor"), createDoctorProfile);

router.get("/me", protect, allowRoles("doctor"), getMyDoctorProfile);

router.patch("/me", protect, allowRoles("doctor"), updateMyDoctorProfile);

router.get("/discover", discoverDoctors);

router.get("/pending", protect, allowRoles("admin"), getPendingDoctors);

router.patch("/:id/approve", protect, allowRoles("admin"), approveDoctor);

router.patch("/:id/reject", protect, allowRoles("admin"), rejectDoctor);

export default router;
