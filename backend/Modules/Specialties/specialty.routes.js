import { Router } from "express";
import {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
} from "./specialty.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllSpecialties);

router.post("/", protect, allowRoles("admin"), createSpecialty);

router.put("/:id", protect, allowRoles("admin"), updateSpecialty);

router.delete("/:id", protect, allowRoles("admin"), deleteSpecialty);

export default router;
