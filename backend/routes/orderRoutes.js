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

// Créer une commande et Récupérer les commandes de l'utilisateur
// router.post("/", authenticationToken, createOrder);
// router.get("/", authenticationToken, getUserOrders);
// Routes NON protégées (pour test seulement)
router.post("/", createOrder);
router.get("/", getUserOrders);
// etc...

// Récupérer une commande spécifique
// router.get("/:orderId", authenticationToken, getOrderById);
router.get("/:orderId", getOrderById);

// Mettre à jour le statut (admin seulement)
// router.put("/:orderId", authenticationToken, updateOrderStatus);
router.put("/:orderId", updateOrderStatus);

export { router as orderRouter };
