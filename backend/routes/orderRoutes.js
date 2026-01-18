// backend/routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrderItem,
  getAllOrders,
  testAllOrders,
  getOrdersByEvent,
  getAdminOrder,
} from '../controllers/orderController.js';
import { authenticationToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticationToken, createOrder);
router.get('/', authenticationToken, getUserOrders);
router.get('/:orderId', authenticationToken, getOrderById);
router.put('/:orderId', authenticationToken, updateOrderStatus);
router.delete('/:orderId/items/:ticketId', authenticationToken, cancelOrderItem);
router.get('/admin/orders', authenticationToken, getAllOrders);
router.get('/test/orders', authenticationToken, testAllOrders);
router.get('/event/:eventId', authenticationToken, getOrdersByEvent);
router.get('/admin/:orderId', authenticationToken, getAdminOrder);

export { router as orderRouter };
