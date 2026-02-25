import { Router } from "express";
import {
  getAllUsers,
  getMyProfile,
  toggleBlockUser,
  deleteUser,
} from "./user.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

// Get my profile (any logged-in user)
router.get("/me", protect, getMyProfile);

// Admin: get all users
router.get("/", protect, allowRoles("admin"), getAllUsers);

// Admin: block / unblock user
router.patch(
  "/:id/toggle-block",
  protect,
  allowRoles("admin"),
  toggleBlockUser,
);

// Admin: delete user
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;
