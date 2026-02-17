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

// Routes pour les clients
router.post("/", authMiddleware, createOrderController);
router.get("/my-orders", authMiddleware, getMyOrdersController);
router.get("/:id", authMiddleware, getOrderByIdController);
router.patch("/:id/cancel", authMiddleware, cancelOrderController);

// Routes pour les admins
router.get("/", authMiddleware, adminMiddleware, getAllOrdersController);
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusController
);

export default router;
