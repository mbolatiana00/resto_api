import { Router } from "express";
import {
  addTrackingPointController,
  getDeliveryTrackingController,
  getLatestTrackingController,
  webhookLocationController,
  getLastLocationController,
} from "../controllers/tracking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Routes webhook en PREMIER (sans auth — appelées par n8n)
router.post("/webhook/location", webhookLocationController);
router.get("/webhook/last/:deliveryId", authMiddleware, getLastLocationController);

// ✅ Routes existantes
router.post("/", authMiddleware, addTrackingPointController);
router.get("/:deliveryId", authMiddleware, getDeliveryTrackingController);
router.get("/:deliveryId/latest", authMiddleware, getLatestTrackingController);

export default router;