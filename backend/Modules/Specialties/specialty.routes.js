import { Router } from "express";
import {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
} from "./specialty.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

// Public: get all specialties
router.get("/", getAllSpecialties);

// Admin: create specialty
router.post("/", protect, allowRoles("admin"), createSpecialty);

// Admin: update specialty
router.put("/:id", protect, allowRoles("admin"), updateSpecialty);

// Admin: delete specialty
router.delete("/:id", protect, allowRoles("admin"), deleteSpecialty);

export default router;
