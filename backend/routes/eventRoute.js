import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../controllers/eventController.js";
const router = express.Router();

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.put("/:eventId", authenticationToken, updateEvent);
router.delete("/:eventId", authenticationToken, deleteEvent);
router.post("/", authenticationToken, createEvent);

export { router as eventRouter };
