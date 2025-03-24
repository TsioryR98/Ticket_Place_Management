// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Créer une commande
router.post("/", authenticationToken, createOrder);

// Récupérer les commandes de l'utilisateur
router.get("/", authenticationToken, getUserOrders);

// Récupérer une commande spécifique
router.get("/:orderId", authenticationToken, getOrderById);

// Mettre à jour le statut (admin seulement)
router.put("/:orderId", authenticationToken, updateOrderStatus);

export { router as orderRouter };
