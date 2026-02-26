import { Router } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.controller.js";
import { protect, allowRoles } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/my",
  protect,
  allowRoles("patient", "doctor", "admin"),
  getMyNotifications,
);

router.patch(
  "/:id/read",
  protect,
  allowRoles("patient", "doctor", "admin"),
  markNotificationAsRead,
);

router.patch(
  "/read-all",
  protect,
  allowRoles("patient", "doctor", "admin"),
  markAllNotificationsAsRead,
);

export default router;
