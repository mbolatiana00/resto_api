import { Request, Response } from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
} from "../services/order.service";
import { OrderStatus } from "@prisma/client";

// Créer une nouvelle commande
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { pickupAddress, deliveryAddress, price } = req.body;

    if (!pickupAddress || !deliveryAddress || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await createOrder({
      userId,
      pickupAddress,
      deliveryAddress,
      price,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Obtenir toutes les commandes (ADMIN)
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const orders = await getAllOrders(status as OrderStatus);
    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Obtenir les commandes de l'utilisateur connecté
export const getMyOrdersController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await getUserOrders(userId);

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Obtenir une commande par ID
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (userRole !== "ADMIN" && order.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await updateOrderStatus(parseInt(id), status);

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Annuler une commande
export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Vérifier les permissions
    if (userRole !== "ADMIN" && order.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Vérifier que la commande peut être annulée
    if (["DELIVERED", "CANCELED"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot cancel order with status: " + order.status,
      });
    }

    const canceledOrder = await cancelOrder(parseInt(id));

    res.json({
      message: "Order canceled successfully",
      order: canceledOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error canceling order" });
  }
};
