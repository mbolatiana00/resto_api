import { Request, Response } from "express";
import {
  createVehicle,
  getVehicleByDriverId,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicle.service";
import { getDriverByUserId } from "../services/driver.service";

// Créer un véhicule pour un livreur
export const createVehicleController = async (req: Request, res: Response) => {
  try {
    const { driverId, type, plateNumber, color } = req.body;

    if (!driverId || !type || !plateNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vehicle = await createVehicle({
      driverId,
      type,
      plateNumber,
      color,
    });

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Driver already has a vehicle" });
    }
    res.status(500).json({ message: "Error creating vehicle" });
  }
};

// Obtenir le véhicule du livreur connecté
export const getMyVehicleController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const driver = await getDriverByUserId(userId);

    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const vehicle = await getVehicleByDriverId(driver.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle" });
  }
};

// Mettre à jour un véhicule
export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, plateNumber, color } = req.body;

    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const currentVehicle = await getVehicleByDriverId(driver.id);
    if (!currentVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const vehicle = await updateVehicle(currentVehicle.id, {
      type,
      plateNumber,
      color,
    });

    res.json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vehicle" });
  }
};

// Supprimer un véhicule
export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteVehicle(parseInt(id));

    res.json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting vehicle" });
  }
};
