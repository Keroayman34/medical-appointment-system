import { Router } from "express";
import multer from "multer";
import {
  addDoctorByAdmin,
  getAllDoctorsForAdmin,
  changeDoctorAvailabilityByAdmin,
  getAdminDashboard,
  getClinicSettings,
  upsertClinicSettings,
  resetClinicSettings,
} from "./admin.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, allowRoles("admin"));

router.post("/add-doctor", upload.single("image"), addDoctorByAdmin);
router.get("/all-doctors", getAllDoctorsForAdmin);
router.post("/change-availability", changeDoctorAvailabilityByAdmin);
router.get("/dashboard", getAdminDashboard);
router.get("/clinic-settings", getClinicSettings);
router.put("/clinic-settings", upsertClinicSettings);
router.delete("/clinic-settings", resetClinicSettings);

export default router;
