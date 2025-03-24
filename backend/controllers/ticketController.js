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
    res.status(200).json({ tickets: result.rows[0].json() });
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
};

/*-------- PUT /api/tickets/:ticketId ADMIN--------- */

export const updateEventTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { type, price, available, limitPerPerson } = req.body;

  try {
    const query = await pool.query(
      "UPDATE tickets SET types = $1, price = $2, available = $3, limit_per_person = $4 WHERE ticket_id = $5 RETURNING *",
      [type, price, available, limitPerPerson]
    );

    if (query.rows.length === 0) {
      return res.status(401).json({ error: "this ticket doesn't exist" });
    }
  } catch (error) {}
};
