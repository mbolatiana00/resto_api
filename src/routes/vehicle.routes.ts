import { Router } from "express";
import {
  createVehicleController,
  getMyVehicleController,
  updateVehicleController,
  deleteVehicleController,
} from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware, driverMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Routes pour les livreurs
router.get("/me", authMiddleware, driverMiddleware, getMyVehicleController);
router.put("/me", authMiddleware, driverMiddleware, updateVehicleController);

// Routes pour les admins
router.post("/", authMiddleware, adminMiddleware, createVehicleController);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVehicleController
);

export default router;
