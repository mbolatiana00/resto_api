import { Request, Response } from "express";
import {
  assignDelivery,
  startDelivery,
  completeDelivery,
  getDeliveryById,
  getDriverDeliveries,
} from "../services/delivery.service";
import { getDriverByUserId } from "../services/driver.service";
import { updateOrderStatus } from "../services/order.service";

// Assigner une livraison à un livreur (ADMIN)
export const assignDeliveryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, driverId } = req.body;

    if (!orderId || !driverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const delivery = await assignDelivery({ orderId, driverId });

    // Mettre à jour le statut de la commande
    await updateOrderStatus(orderId, "CONFIRMED");

    res.status(201).json({
      message: "Delivery assigned successfully",
      delivery,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Delivery already assigned to this order" });
    }
    res.status(500).json({ message: "Error assigning delivery" });
  }
};

// Démarrer une livraison (DRIVER)
export const startDeliveryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const delivery = await getDeliveryById(parseInt(id));
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.driverId !== driver.id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this delivery" });
    }

    if (delivery.startedAt) {
      return res.status(400).json({ message: "Delivery already started" });
    }

    const updatedDelivery = await startDelivery(parseInt(id));

    // Mettre à jour le statut de la commande
    await updateOrderStatus(delivery.orderId, "PICKED_UP");

    res.json({
      message: "Delivery started successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting delivery" });
  }
};

// Compléter une livraison (DRIVER)
export const completeDeliveryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const delivery = await getDeliveryById(parseInt(id));
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.driverId !== driver.id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this delivery" });
    }

    if (!delivery.startedAt) {
      return res
        .status(400)
        .json({ message: "Delivery must be started first" });
    }

    if (delivery.endedAt) {
      return res.status(400).json({ message: "Delivery already completed" });
    }

    const updatedDelivery = await completeDelivery(parseInt(id));

    // Mettre à jour le statut de la commande
    await updateOrderStatus(delivery.orderId, "DELIVERED");

    res.json({
      message: "Delivery completed successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error completing delivery" });
  }
};

// Obtenir une livraison par ID
export const getDeliveryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const delivery = await getDeliveryById(parseInt(id));

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching delivery" });
  }
};

// Obtenir les livraisons du livreur connecté
export const getMyDeliveriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const driver = await getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const deliveries = await getDriverDeliveries(driver.id);

    res.json({
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching deliveries" });
  }
};
