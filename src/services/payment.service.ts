import { PrismaClient, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface CreatePaymentData {
  orderId: number;
  amount: number;
  method: string;
}

export const createPayment = async (data: CreatePaymentData) => {
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
    },
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
        },
      },
    },
  });
};

export const getPaymentById = async (id: number) => {
  return prisma.payment.findUnique({
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
        },
      },
    },
  });
};

export const getOrderPayment = async (orderId: number) => {
  return prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: {
        select: {
          id: true,
          status: true,
          pickupAddress: true,
          deliveryAddress: true,
          price: true,
        },
      },
    },
  });
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: PaymentStatus
) => {
  const data: any = { status };

  // Si le paiement est marqué comme payé, enregistrer la date
  if (status === "PAID") {
    data.paidAt = new Date();
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data,
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
        },
      },
    },
  });
};
