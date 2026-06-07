import { Request, Response } from "express";
import {
  addTrackingPoint,
  getDeliveryTracking,
  getLatestTrackingPoint,
} from "../services/tracking.service";
import { getDeliveryById } from "../services/delivery.service";
import { getDriverByUserId } from "../services/driver.service";

// Ajouter un point de tracking (DRIVER)
export const addTrackingPointController = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId, latitude, longitude } = req.body;
    const userId = (req as any).user.id;

    if (!deliveryId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Vérifier que le livreur est assigné à cette livraison
    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.driverId !== driver.id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this delivery" });
    }

    const trackingPoint = await addTrackingPoint({
      deliveryId,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: "Tracking point added successfully",
      tracking: trackingPoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding tracking point" });
  }
};

// Obtenir tous les points de tracking d'une livraison
export const getDeliveryTrackingController = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;

    const tracking = await getDeliveryTracking(parseInt(deliveryId));

    res.json({
      count: tracking.length,
      tracking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tracking data" });
  }
};

// Obtenir la dernière position d'une livraison
export const getLatestTrackingController = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;

    const latestTracking = await getLatestTrackingPoint(parseInt(deliveryId));

    if (!latestTracking) {
      return res.status(404).json({ message: "No tracking data found" });
    }

    res.json(latestTracking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching latest tracking" });
  }
};
// ✅ Reçoit position depuis n8n webhook (sans auth)
export const webhookLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId, latitude, longitude, accuracy, userId, role } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Missing latitude or longitude" });
    }

    console.log(`📍 Position reçue [${role || "UNKNOWN"}] → lat:${latitude} lng:${longitude} userId:${userId}`);

    // Si deliveryId valide → sauvegarde en base
    if (deliveryId && deliveryId > 0) {
      const trackingPoint = await addTrackingPoint({
        deliveryId : Number(deliveryId),
        latitude   : Number(latitude),
        longitude  : Number(longitude),
      });
      return res.status(201).json({ message: "Position saved", tracking: trackingPoint });
    }

    // Sinon → juste logger la position (utilisateur sans livraison active)
    res.status(200).json({
      message   : "Position received",
      latitude,
      longitude,
      userId,
      role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing location" });
  }
};

// ✅ Dernière position — Android poll toutes les 30s
export const getLastLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;

    const latestTracking = await getLatestTrackingPoint(parseInt(deliveryId));

    if (!latestTracking) {
      return res.status(404).json({ message: "No location found" });
    }

    res.json(latestTracking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching location" });
  }
};
