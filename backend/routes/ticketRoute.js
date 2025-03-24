import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";
import { getAllEventsTicket,updateEventTicket, createEventTicket ,deleteEventTicket } from "../controllers/ticketController.js";
const router = express.Router();

// Get all tickets for an event
router.get('/api/events/:eventId/tickets',getAllEventsTicket);

// Add a new ticket for an event (admin only) 
router.post('/api/events/:eventId/tickets', createEventTicket);

// Update a ticket by ID (admin only)
router.put('/api/tickets/:ticketId', updateEventTicket);

// Delete a ticket by ID and (admin only) 
router.delete('/api/events/:eventId/tickets/:ticketId', deleteEventTicket);


export { router as ticketRouter };