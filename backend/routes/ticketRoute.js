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

// Get all tickets for an event
router.get('/:eventId/tickets', getAllEventsTicket);

// Add a new ticket for an event (admin only)
router.post('/:eventId/tickets', authenticationToken, createEventTicket);

// Update a ticket by ID (admin only)
router.put('/:eventId/tickets/:ticketId', authenticationToken, updateEventTicket);

// Delete a ticket by ID and (admin only)
router.delete('/:eventId/tickets/:ticketId', authenticationToken, deleteEventTicket);

// Get a specific ticket by ID
router.get('/:eventId/tickets/:ticketId', getEventTicketById);

export { router as ticketRouter };
