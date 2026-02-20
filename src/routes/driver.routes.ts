import { Router } from "express";
import {
  createDriverController,
  getAllDriversController,
  getDriverByIdController,
  getMyDriverProfileController,
  updateDriverAvailabilityController,
  deleteDriverController,
} from "../controllers/driver.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware, driverMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Routes pour les livreurs
router.get(
  "/me",
  authMiddleware,
  driverMiddleware,
  getMyDriverProfileController
);
router.patch(
  "/availability",
  authMiddleware,
  driverMiddleware,
  updateDriverAvailabilityController
);

// Routes pour les admins
router.post("/", authMiddleware, adminMiddleware, createDriverController);
router.get("/", authMiddleware, adminMiddleware, getAllDriversController);
router.get("/:id", authMiddleware, adminMiddleware, getDriverByIdController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDriverController);

export default router;
