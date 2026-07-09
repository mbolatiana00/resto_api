import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // chemin relatif depuis lib/prisma.ts


function getUserId(req: Request) {
  return (req as any).user?.id;
}

// GET /api/notifications?unread=true&page=1&limit=20
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const unreadOnly = req.query.unread === "true";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const where = {
      userId,
      ...(unreadOnly ? { read: false } : {}),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des notifications." });
  }
}

// GET /api/notifications/unread-count
export async function getUnreadCount(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du comptage des notifications." });
  }
}

// PATCH /api/notifications/:id/read
export async function markAsRead(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const id = Number(req.params.id);

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: "Notification introuvable." });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date(), status: "SENT" },
    });

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la notification." });
  }
}

// PATCH /api/notifications/read-all
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date(), status: "SENT" },
    });

    res.json({ message: "Toutes les notifications ont été marquées comme lues." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des notifications." });
  }
}
