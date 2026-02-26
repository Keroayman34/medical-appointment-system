import { Router } from "express";
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  toggleBlockUser,
  deleteUser,
} from "./user.controller.js";

import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);

router.get("/", protect, allowRoles("admin"), getAllUsers);

router.patch(
  "/:id/toggle-block",
  protect,
  allowRoles("admin"),
  toggleBlockUser,
);

router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;
