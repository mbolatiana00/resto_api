import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface deliveryData {
    orderId: number,
    driverId: number
}

export const assignDelivery = async (data: deliveryData) => {
    return prisma.delivery.create({
        data: {
            orderId: data.orderId,
            driverId: data.driverId,
        },
        include: {
            order: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            },
            driver: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        }
                    },
                    vehicle: true
                },

            }
        }
    })
}

export const startDelivery = async (deliveryId: number) => {
    return prisma.delivery.update({
        where: { id: deliveryId },
        data: {
            startedAt: new Date(),
        },
        include: {
            order: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        },
                    },
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
    })
}

export const completeDelivery = async (deliveryId: number) => {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      endedAt: new Date(),
    },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
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
  });
};

export const getDeliveryById = async (id: number) => {
  return prisma.delivery.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          payment: true,
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
      tracking: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const getDriverDeliveries = async (driverId: number) => {
  return prisma.delivery.findMany({
    where: { driverId },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
      tracking: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};
