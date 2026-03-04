import { PrismaClient, vehicle_type } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateVehicleData {
  driverId: number;
  type: vehicle_type;
  plateNumber: string;
  color?: string;
}

interface UpdateVehicleData {
  type?: vehicle_type;
  plateNumber?: string;
  color?: string;
}

export const createVehicle = async (data: CreateVehicleData) => {
  return prisma.vehicle.create({
    data: {
      driverId: data.driverId,
      type: data.type,
      plateNumber: data.plateNumber,
      color: data.color,
    },
    include: {
      driver: {
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

export const getVehicleByDriverId = async (driverId: number) => {
  return prisma.vehicle.findUnique({
    where: { driverId },
    include: {
      driver: {
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

export const updateVehicle = async (
  vehicleId: number,
  data: UpdateVehicleData
) => {
  return prisma.vehicle.update({
    where: { id: vehicleId },
    data,
    include: {
      driver: {
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

export const deleteVehicle = async (vehicleId: number) => {
  return prisma.vehicle.delete({
    where: { id: vehicleId },
  });
};
