import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  cancelOrderController,
} from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";
const router = Router();

// ✅ Routes statiques en premier
router.post("/", authMiddleware, createOrderController);
router.get("/", authMiddleware, adminMiddleware, getAllOrdersController);
router.get("/user/:userId", authMiddleware, getMyOrdersController); // aligné avec Android

// ✅ Routes dynamiques en dernier
router.get("/:id", authMiddleware, getOrderByIdController);
router.patch("/:id/cancel", authMiddleware, cancelOrderController);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatusController);


router.get("/", authMiddleware, adminMiddleware, getAllOrdersController);
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusController
);

export default router;
