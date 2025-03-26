import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";
import { addItemForOrder } from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/:orderId/items", authenticationToken, addItemForOrder);
