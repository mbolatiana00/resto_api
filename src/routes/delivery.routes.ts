import { Router } from "express";
import {
  assignDeliveryController,
  startDeliveryController,
  completeDeliveryController,
  getDeliveryByIdController,
  getMyDeliveriesController,
} from "../controllers/delivery.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware, driverMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Routes pour les livreurs
router.get(
  "/my-deliveries",
  authMiddleware,
  driverMiddleware,
  getMyDeliveriesController
);
router.patch(
  "/:id/start",
  authMiddleware,
  driverMiddleware,
  startDeliveryController
);
router.patch(
  "/:id/complete",
  authMiddleware,
  driverMiddleware,
  completeDeliveryController
);

// Routes pour les admins
router.post("/assign", authMiddleware, adminMiddleware, assignDeliveryController);
router.get("/:id", authMiddleware, getDeliveryByIdController);

export default router;
