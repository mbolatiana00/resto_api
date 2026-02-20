import { Request, Response } from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriverAvailability,
  getDriverByUserId,
  deleteDriver,
} from "../services/driver.service";

// Créer un nouveau livreur
export const createDriverController = async (req: Request, res: Response) => {
  try {
    const { userId, licenseNo } = req.body;

    if (!userId || !licenseNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const driver = await createDriver({ userId, licenseNo });

    res.status(201).json({
      message: "Driver created successfully",
      driver,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "User is already a driver" });
    }
    res.status(500).json({ message: "Error creating driver" });
  }
};

// Obtenir tous les livreurs
export const getAllDriversController = async (req: Request, res: Response) => {
  try {
    const { available } = req.query;
    const isAvailable =
      available === "true" ? true : available === "false" ? false : undefined;

    const drivers = await getAllDrivers(isAvailable);

    res.json({
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching drivers" });
  }
};

// Obtenir un livreur par ID
export const getDriverByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await getDriverById(parseInt(id));

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching driver" });
  }
};

// Obtenir le profil du livreur connecté
export const getMyDriverProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const driver = await getDriverByUserId(userId);

    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching driver profile" });
  }
};

// Mettre à jour la disponibilité du livreur
export const updateDriverAvailabilityController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ message: "isAvailable must be a boolean" });
    }

    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const updatedDriver = await updateDriverAvailability(
      driver.id,
      isAvailable
    );

    res.json({
      message: "Driver availability updated",
      driver: updatedDriver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating driver availability" });
  }
};

// Supprimer un livreur
export const deleteDriverController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteDriver(parseInt(id));

    res.json({
      message: "Driver deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting driver" });
  }
};
