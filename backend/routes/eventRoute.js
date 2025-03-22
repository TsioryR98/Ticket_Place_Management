import express from "express";
import { getAllEvents, getEvent } from "../controllers/eventController.js";
const router = express.Router();

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);

export { router as eventRouter };
