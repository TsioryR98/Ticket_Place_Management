import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all events GET /api/events USER ok--------- */

export const getAllEvents = async (req, res) => {
  try {
    const [resultEvent, totalResult, resultTicket] = await Promise.all([
      pool.query("SELECT * FROM events"),
      pool.query("SELECT COUNT(*) FROM events"),
      pool.query("SELECT*FROM tickets"),
    ]);

    const total = parseInt(totalResult.rows[0].count, 10);
    //Add x-total-Count and getting from headers for pagination

    res.set("X-Total-Count", total);

    //filter ticket for on event ( ticket.event_id === event.event_id
    const events = resultEvent.rows.map((event) => {
      const eventTicket = resultTicket.rows
        .filter((ticket) => ticket.event_id === event.event_id)
        .map((ticket) => ({
          type: ticket.types,
          price: Number(ticket.price),
          available: ticket.available,
          limitPerPerson: ticket.limit_per_person,
        }));

      return {
        id: event.event_id,
        title: event.title,
        description: event.descriptions,
        date: new Date(event.event_datetime).toISOString().split("T")[0], // Format YYYY-MM-DD
        time: new Date(event.event_datetime).toTimeString().split(" ")[0], // Format HH:MM:SS
        location: event.locations,
        organizer: event.organizer,
        category: event.category,
        images: event.imagepath,
        tickets: eventTicket,
      };
    });
    res.status(200).json(events);
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
};

/*--------get 1 event GET /api/events/:eventId ok USER--------- */

export const getEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    //LEFT JOIN all macth from event
    const result = await pool.query(
      "SELECT\n" +
        "  e.event_id,\n" +
        "  e.title,\n" +
        "  e.descriptions,\n" +
        "  e.event_datetime,\n" +
        "  e.locations,\n" +
        "  e.organizer,\n" +
        "  e.category,\n" +
        "  t.ticket_id,\n" +
        "  t.types,\n" +
        "  t.price,\n" +
        "  t.available,\n" +
        "  t.limit_per_person\n" +
        "FROM events e\n" +
        "LEFT JOIN tickets t ON e.event_id = t.event_id\n" +
        "WHERE e.event_id = $1",
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }
    // format rows0 to string
    const event = {
      id: result.rows[0].event_id,
      title: result.rows[0].title,
      description: result.rows[0].descriptions, ///    "date": "2025-06-10T07:00:00.000Z","time": "09:00:00 GMT+0200
      date: new Date(result.rows[0].event_datetime).toISOString().split("T")[0], // Format YYYY-MM-DD from T
      time: new Date(result.rows[0].event_datetime)
        .toTimeString()
        .split(" ")[0], // Format HH:MM:SS
      location: result.rows[0].locations,
      organizer: result.rows[0].organizer,
      category: result.rows[0].category,
      tickets: result.rows.map((row) => ({
        types: row.types,
        price: Number(row.price),
        available: row.available,
        limitPerPerson: row.limit_per_person,
      })),
    };

    res.status(200).json(event);
  } catch (error) {
    handleError(res, "Error while getting event", error);
  }
};

/*--------UPDATE 1 event POST /api/events/save  ok ADMIN--------- */

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { description, date, time, location } = req.body;
  const eventDatetime = `${date} ${time}`;

  if (req.user.role !== "user") {
    // only for user and change role into admin and organizer
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    const saveQuery = await pool.query(
      "UPDATE events SET descriptions= $1,event_datetime= $2,locations= $3 WHERE event_id=$4 RETURNING *",
      [description, eventDatetime, location, eventId]
    );

    if (saveQuery.rows.length === 0) {
      return res.status(401).json({ error: "this event doesn't exist" });
    }
    res.status(200).json(saveQuery.rows[0]);
  } catch (error) {
    handleError(res, "Error during update event", error);
  }
};

/*----DELETE /api/events/:eventId -----ADMIN ok*/

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const { role } = req.user;
  if (role !== "user") {
    // only for user and change role into admin and organizer
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    const result = await pool.query(
      "DELETE FROM events WHERE event_id=$1 RETURNING *",
      [eventId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "event not found" });
    }
    const event = result.rows[0];

    res.status(200).json(event);
  } catch (error) {
    handleError(res, "Error while getting event", error);
  }
};

/*----POST /api/events -----ADMIN ok*/

export const createEvent = async (req, res) => {
  const { role } = req.user;
  const { title, description, date, time, locations, organizer, category } =
    req.body;
  const eventDatetime = `${date} ${time}`;

  if (role !== "user") {
    // only for user and change role into admin and organizer if exist
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO events (title, descriptions, event_datetime , locations ,organizer ,category )VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, eventDatetime, locations, organizer, category]
    );
    // Input validation
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !locations ||
      !organizer ||
      !category
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const event = result.rows[0];

    res.status(201).json(event);
  } catch (error) {
    handleError(res, "Error while creating event", error);
  }
};
