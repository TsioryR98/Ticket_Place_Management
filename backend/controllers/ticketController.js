import pool from "../dbConfig.js";
import { updateEvent } from "./eventController.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*-------- GET /api/events/:eventId/tickets--------- */

export const getAllEventsTicket = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE event_id = $1",
      [eventId]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "event not found" });
      }
      res.status(200).json({tickets : result.rows[0].json()});
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
};

/*-------- POST /api/events/:eventId/tickets ADMIN--------- */

export const updateEventTicket = async (req, res) => {
    const { eventId } = req.params;
    const {}
    try {
        
    } catch (error) {
        
    }
}