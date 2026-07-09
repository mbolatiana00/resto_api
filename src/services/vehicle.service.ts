import { prisma} from "../lib/prisma"; // chemin relatif depuis lib/prisma.ts
import {VehicleType} from "../generated/prisma/enums"; // chemin relatif depuis generated/prisma/enums.ts


interface CreateVehicleData {
  driverId: number;
  type: VehicleType;
  plateNumber: string;
  color?: string;
}

interface UpdateVehicleData {
  type?: VehicleType;
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
