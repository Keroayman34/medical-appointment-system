import { Router } from "express";
import {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
} from "./specialty.controller.js";

import { protect, allowSuperAdmin } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllSpecialties);

router.post("/", protect, allowSuperAdmin(), createSpecialty);

router.put("/:id", protect, allowSuperAdmin(), updateSpecialty);

router.delete("/:id", protect, allowSuperAdmin(), deleteSpecialty);

export default router;
