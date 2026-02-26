import { Router } from "express";
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  toggleBlockUser,
  deleteUser,
} from "./user.controller.js";

import { protect, allowSuperAdmin } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);

router.get("/", protect, allowSuperAdmin(), getAllUsers);

router.patch("/:id/toggle-block", protect, allowSuperAdmin(), toggleBlockUser);

router.delete("/:id", protect, allowSuperAdmin(), deleteUser);

export default router;
