import { prisma } from "../lib/prisma";

export const restaurantService = {

  // Tous les restaurants (avec pagination)
  getAllRestaurants: async (page = 1, limit = 20, search?: string) => {
    const skip = (page - 1) * limit;

    const where = search
      ? { name: { contains: search } }
      : {};

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.restaurant.count({ where }),
    ]);

    return {
      restaurants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Un restaurant par ID avec ses plats
  getRestaurantById: async (id: number) => {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' },
        },
      },
    });
    if (!restaurant) throw new Error('Restaurant introuvable');
    return restaurant;
  },

  // Tous les plats d'un restaurant (avec pagination + filtre catégorie)
  getMenuItemsByRestaurant: async (
    restaurantId: number,
    page = 1,
    limit = 20,
    category?: string
  ) => {
    const skip = (page - 1) * limit;

    const where: any = { restaurantId, isAvailable: true };
    if (category && category !== 'Tout') {
      where.category = category;
    }

    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { category: 'asc' },
      }),
      prisma.menuItem.count({ where }),
    ]);

    return {
      menuItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Tous les plats (home screen) avec pagination + filtre catégorie + recherche
  getAllMenuItems: async (
    page = 1,
    limit = 20,
    category?: string,
    search?: string
  ) => {
    const skip = (page - 1) * limit;

    const where: any = { isAvailable: true };
    if (category && category !== 'Tout') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { restaurant: { name: { contains: search } } },
      ];
    }

    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          restaurant: {
            select: { id: true, name: true, imageUrl: true, isOpen: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.menuItem.count({ where }),
    ]);

    return {
      menuItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Catégories distinctes
  getCategories: async () => {
    const cats = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return ['Tout', ...cats.map((c: { category: string | null }) => c.category)];
  },
};