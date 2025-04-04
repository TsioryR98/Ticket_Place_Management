import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  getEventById,
  updateEvent,
} from "../controllers/eventController.js";
const router = express.Router();

router.get("/", getAllEvents);
router.put("/:id/update", authenticationToken, updateEvent); // admin
router.get("/:eventId", getEvent);
router.get("/:id/details", authenticationToken, getEventById);
router.delete("/:id/delete", authenticationToken, deleteEvent); // admin
router.post("/create", authenticationToken, createEvent); // admin

export { router as eventRouter };
