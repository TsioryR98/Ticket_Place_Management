import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all events GET /api/events --------- */

export const getAllEvents = async (req, res) => {
  try {
    const [resultEvent, totalResult] = await Promise.all([
      pool.query("SELECT * FROM events"),
      pool.query("SELECT COUNT(*) FROM events"),
    ]);

    const total = parseInt(totalResult.rows[0].count, 10);
    //for pagination     //Add x-total-Count and getting from headers

    res.set("X-Total-Count", total);

    const events = resultEvent.rows.map((ev) => ({
      ...ev,
      created_at: new Date(ev.created_at).toISOString(),
    }));
    res.status(200).json(events);
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
};

/*--------get 1 event GET /api/events/:eventId --------- */

export const getEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM events WHERE event_id =$1", [
      eventId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }
    const event = result.rows[0];
    res.status(200).json(event);
  } catch (error) {
    handleError(res, "Error while getting event", error);
  }
};

/*--------save 1 event POST /api/events/save  ADMIN--------- */

export const saveEvent = async (req, res) => {
  try {
    const {} = req.body;
  } catch (error) {}
};
