import express from 'express';
import { authenticationToken } from '../middleware/authMiddleware.js';
import {
  getAllEventsTicket,
  updateEventTicket,
  createEventTicket,
  deleteEventTicket,
  getEventTicketById,
} from '../controllers/ticketController.js';
const router = express.Router();

router.get('/:eventId/tickets', getAllEventsTicket);
router.post('/:eventId/tickets', authenticationToken, createEventTicket);
router.put('/:eventId/tickets/:ticketId', authenticationToken, updateEventTicket);
router.delete('/:eventId/tickets/:ticketId', authenticationToken, deleteEventTicket);
router.get('/:eventId/tickets/:ticketId', getEventTicketById);

export { router as ticketRouter };
