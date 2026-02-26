import express from "express";
import {
  createDoctorProfile,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  discoverDoctors,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  deleteDoctorByAdmin,
} from "./doctor.controller.js";
import {
  protect,
  allowRoles,
  allowSuperAdmin,
} from "../../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("doctor"), createDoctorProfile);

router.get("/me", protect, allowRoles("doctor"), getMyDoctorProfile);

router.patch("/me", protect, allowRoles("doctor"), updateMyDoctorProfile);

router.get("/discover", discoverDoctors);

router.get("/pending", protect, allowSuperAdmin(), getPendingDoctors);

router.patch("/:id/approve", protect, allowSuperAdmin(), approveDoctor);

router.patch("/:id/reject", protect, allowSuperAdmin(), rejectDoctor);

router.delete("/:id", protect, allowRoles("admin"), deleteDoctorByAdmin);

export default router;
