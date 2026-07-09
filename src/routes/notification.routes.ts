import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.get("/notifications", authMiddleware, getNotifications);
router.get("/notifications/unread-count", authMiddleware, getUnreadCount);
router.patch("/notifications/:id/read", authMiddleware, markAsRead);
router.patch("/notifications/read-all", authMiddleware, markAllAsRead);

export default router;
