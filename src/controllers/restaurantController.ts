import { Request, Response } from 'express';
import { restaurantService } from '../services/restaurantService';

export const restaurantController = {

  // GET /resto_api/restaurants?page=1&limit=20&search=pizza
  getAllRestaurants: async (req: Request, res: Response) => {
    try {
      const page     = parseInt(req.query.page as string)   || 1;
      const limit    = parseInt(req.query.limit as string)  || 20;
      const search   = req.query.search as string | undefined;

      const result = await restaurantService.getAllRestaurants(page, limit, search);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /resto_api/restaurants/:id
  getRestaurantById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const restaurant = await restaurantService.getRestaurantById(id);
      res.json({ success: true, restaurant });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // GET /resto_api/restaurants/:id/menu?page=1&limit=20&category=Pizzas
  getMenuByRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const page         = parseInt(req.query.page as string)     || 1;
      const limit        = parseInt(req.query.limit as string)    || 20;
      const category     = req.query.category as string | undefined;

      const result = await restaurantService.getMenuItemsByRestaurant(
        restaurantId, page, limit, category
      );
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /resto_api/restaurants/menu/all?page=1&limit=20&category=Pizzas&search=romazava
  getAllMenuItems: async (req: Request, res: Response) => {
    try {
      const page     = parseInt(req.query.page as string)   || 1;
      const limit    = parseInt(req.query.limit as string)  || 20;
      const category = req.query.category as string | undefined;
      const search   = req.query.search   as string | undefined;

      const result = await restaurantService.getAllMenuItems(page, limit, category, search);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /resto_api/restaurants/categories
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await restaurantService.getCategories();
      res.json({ success: true, categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};