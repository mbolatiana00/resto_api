import { Response, Request, NextFunction } from "express";


export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};

// Middleware pour vérifier que l'utilisateur est un livreur
export const driverMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "DRIVER" && user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Driver only." });
  }

  next();
};

// Middleware pour vérifier que l'utilisateur est un client
export const clientMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "CLIENT" && user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Client only." });
  }

  next();
};
