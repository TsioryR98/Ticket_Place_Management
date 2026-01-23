import { validateOrder } from '../controllers/orderValidatorController.js';
import express from 'express';
import { authenticationToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:orderId/validate', authenticationToken, validateOrder);

export { router as orderValidatorRouter };
