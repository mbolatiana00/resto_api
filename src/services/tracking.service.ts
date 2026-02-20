import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AddTrackingPointData {
  deliveryId: number;
  latitude: number;
  longitude: number;
}

export const addTrackingPoint = async (data: AddTrackingPointData) => {
  return prisma.tracking.create({
    data: {
      deliveryId: data.deliveryId,
      latitude: data.latitude,
      longitude: data.longitude,
    },
    include: {
      delivery: {
        include: {
          order: {
            select: {
              id: true,
              pickupAddress: true,
              deliveryAddress: true,
            },
          },
        },
      },
    },
  });
};

export const getDeliveryTracking = async (deliveryId: number) => {
  return prisma.tracking.findMany({
    where: { deliveryId },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getLatestTrackingPoint = async (deliveryId: number) => {
  return prisma.tracking.findFirst({
    where: { deliveryId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      delivery: {
        include: {
          order: {
            select: {
              id: true,
              pickupAddress: true,
              deliveryAddress: true,
              status: true,
            },
          },
          driver: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
              vehicle: true,
            },
          },
        },
      },
    },
  });
};
