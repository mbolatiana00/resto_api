import { Router } from "express";
import {
  createPaymentController,
  getPaymentByIdController,
  getOrderPaymentController,
  updatePaymentStatusController,
  confirmPaymentController,
} from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Routes pour les clients
router.post("/", authMiddleware, createPaymentController);
router.get("/order/:orderId", authMiddleware, getOrderPaymentController);
router.get("/:id", authMiddleware, getPaymentByIdController);

// Routes pour les admins
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatusController
);

// Route pour confirmer le paiement (webhook ou simulation)
router.post("/:id/confirm", confirmPaymentController);

export default router;
