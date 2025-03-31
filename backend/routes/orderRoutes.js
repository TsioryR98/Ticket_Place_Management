// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrderItem,
} from "../controllers/orderController.js";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticationToken, createOrder);
router.get("/", authenticationToken, getUserOrders);
router.get("/:orderId", authenticationToken, getOrderById);
router.put("/:orderId", authenticationToken, updateOrderStatus);
router.delete(
  "/:orderId/items/:ticketId",
  authenticationToken,
  cancelOrderItem
);

export { router as orderRouter };
