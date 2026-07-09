import { prisma } from "../lib/prisma";
import crypto from "crypto";

const LOYALTY_THRESHOLD = 10;       // nb commandes en 1 semaine
const DISCOUNT_PERCENT  = 10;       // % de réduction
const COUPON_VALIDITY_DAYS = 30;    // validité du coupon généré

// Génère un code unique ex: FIDEL-A3F9B2-7
function generateCouponCode(userId: number, restaurantId: number): string {
  const hash = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();
  return `FIDEL-${hash}-${userId}${restaurantId}`;
}

export async function checkAndGrantLoyaltyCoupon(
  userId: number,
  restaurantId: number
): Promise<{ granted: boolean; coupon?: any }> {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const orderCount = await prisma.order.count({
    where: {
      userId,
      restaurantId,
      status: "DELIVERED",
      createdAt: { gte: since },
    },
  });

  if (orderCount < LOYALTY_THRESHOLD) {
    return { granted: false };
  }

  const existing = await prisma.coupon.findFirst({
    where: {
      userId,
      restaurantId,
      status: "ACTIVE",
      expiresAt: { gte: new Date() },
    },
  });

  if (existing) {
    return { granted: false };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + COUPON_VALIDITY_DAYS);

  const coupon = await prisma.coupon.create({
    data: {
      code:            generateCouponCode(userId, restaurantId),
      discountPercent: DISCOUNT_PERCENT,
      restaurantId,
      userId,
      status:          "ACTIVE",
      expiresAt,
    },
  });

  return { granted: true, coupon };
}

export async function applyCoupon(
  code: string,
  userId: number,
  restaurantId: number,
  originalAmount: number
): Promise<{ finalAmount: number; discount: number; coupon: any }> {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code,
      userId,
      restaurantId,
      status:    "ACTIVE",
      expiresAt: { gte: new Date() },
    },
  });

  if (!coupon) {
    throw new Error("Coupon invalide, expiré ou déjà utilisé.");
  }

  const discountAmount = (originalAmount * coupon.discountPercent) / 100;
  const finalAmount    = Math.round(originalAmount - discountAmount);

  const updated = await prisma.coupon.update({
    where: { id: coupon.id },
    data:  { status: "USED", usedAt: new Date() },
  });

  return { finalAmount, discount: discountAmount, coupon: updated };
}

export async function getUserCoupons(userId: number) {
  return prisma.coupon.findMany({
    where: {
      userId,
      status:    "ACTIVE",
      expiresAt: { gte: new Date() },
    },
    include: { restaurant: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function grantLoyaltyCouponsForAllRestaurants(
  userId: number
): Promise<{ restaurantId: number; granted: boolean; coupon?: any }[]> {
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true },
  });

  const results = [];
  for (const r of restaurants) {
    const result = await checkAndGrantLoyaltyCoupon(userId, r.id);
    results.push({ restaurantId: r.id, ...result });
  }
  return results;
}
