import { Router } from "express";
import {
  addTrackingPointController,
  getDeliveryTrackingController,
  getLatestTrackingController,
} from "../controllers/tracking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { driverMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Routes pour les livreurs
router.post(
  "/",
  authMiddleware,
  driverMiddleware,
  addTrackingPointController
);

// Routes accessibles à tous les utilisateurs authentifiés
router.get("/:deliveryId", authMiddleware, getDeliveryTrackingController);
router.get("/:deliveryId/latest", authMiddleware, getLatestTrackingController);

export default router;
