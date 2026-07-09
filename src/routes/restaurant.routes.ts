import { Router } from 'express';
import { restaurantController} from '../controllers/restaurantController';
const router = Router();

// Ordre important : routes fixes avant routes dynamiques (:id)
router.get('/categories', restaurantController.getCategories);
router.get('/menu/all',   restaurantController.getAllMenuItems);
router.get('/',       restaurantController.getAllRestaurants);
router.get('/:id',        restaurantController.getRestaurantById);
router.get('/:id/menu',   restaurantController.getMenuByRestaurant);

export default router;