import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all events GET /api/events USER ok--------- */

export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const offset = (page - 1) * perPage;

    // Get paginated events and total count
    const [resultEvent, totalResult] = await Promise.all([
      pool.query(
        `SELECT * FROM events ORDER BY event_datetime LIMIT $1 OFFSET $2`,
        [perPage, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM events`),
    ]);

    const total = parseInt(totalResult.rows[0].count, 10);
    res.set("X-Total-Count", total);

    // Get tickets for all fetched events
    const eventIds = resultEvent.rows.map((event) => event.event_id);
    const resultTicket = await pool.query(
      `SELECT * FROM tickets WHERE event_id = ANY($1::uuid[])`,
      [eventIds]
    );

    // Transform events with their tickets
    const events = resultEvent.rows.map((event) => {
      const eventTickets = resultTicket.rows
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
        date: new Date(event.event_datetime).toISOString().split("T")[0],
        time: new Date(event.event_datetime).toTimeString().split(" ")[0],
        location: event.locations,
        organizer: event.organizer,
        category: event.category,
        images: event.imagepath,
        tickets: eventTickets,
      };
    });

    res.status(200).json(events);
  } catch (error) {
    handleError(res, "Error during fetching events from database", error);
  }
};

/*--------get 1 event GET /api/events/:eventId ok USER--------- */

export const getEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        e.event_id,
        e.title,
        e.descriptions,
        e.event_datetime,
        e.locations,
        e.organizer,
        e.category,
        e.imagepath,
        t.ticket_id,
        t.types,
        t.price,
        t.available,
        t.limit_per_person
      FROM events e
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE e.event_id = $1`,
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }

    const event = {
      id: eventId,
      title: result.rows[0].title,
      description: result.rows[0].descriptions,
      date: new Date(result.rows[0].event_datetime).toISOString().split("T")[0],
      time: new Date(result.rows[0].event_datetime)
        .toTimeString()
        .split(" ")[0],
      location: result.rows[0].locations,
      organizer: result.rows[0].organizer,
      category: result.rows[0].category,
      imagePath: result.rows[0].imagepath,
      tickets: result.rows[0].ticket_id
        ? result.rows.map((row) => ({
            ticket_id: row.ticket_id,
            type: row.types,
            price: Number(row.price),
            available: row.available,
            limitPerPerson: row.limit_per_person,
          }))
        : [],
    };

    res.status(200).json(event);
  } catch (error) {
    handleError(res, "Error while getting event", error);
  }
};

/*--------UPDATE 1 event POST /api/events/  ok ADMIN--------- */

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category } = req.body;
  const eventDatetime = `${date} ${time}`;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden request" });
  }

  try {
    const saveQuery = await pool.query(
      "UPDATE events SET title=$1, descriptions=$2, event_datetime=$3, locations=$4 , category=$5 WHERE event_id=$6 RETURNING *",
      [title, description, eventDatetime, location, category, id]
    );

    if (saveQuery.rows.length === 0) {
      return res.status(404).json({ error: "This event doesn't exist" });
    }

    // Format the response to match frontend expectations
    const updatedEvent = saveQuery.rows[0];
    const responseData = {
      title: updatedEvent.title,
      descriptions: updatedEvent.descriptions,
      event_datetime: updatedEvent.event_datetime,
      locations: updatedEvent.locations,
      organizer: updatedEvent.organizer,
      category: updatedEvent.category,
    };

    res.status(200).json(responseData);
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

/*--------get 1 event GET /api/events/:id/details ok ADMIN--------- */

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        e.event_id,
        e.title,
        e.descriptions,
        e.event_datetime,
        e.locations,
        e.organizer,
        e.category,
        e.imagepath,
        t.ticket_id,
        t.types,
        t.price,
        t.available,
        t.limit_per_person
      FROM events e
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE e.event_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }

    return res.status(200).json({
      id: id,
      title: result.rows[0].title,
      description: result.rows[0].descriptions,
      date: new Date(result.rows[0].event_datetime).toISOString().split("T")[0],
      time: new Date(result.rows[0].event_datetime)
        .toTimeString()
        .split(" ")[0],
      location: result.rows[0].locations,
      organizer: result.rows[0].organizer,
      category: result.rows[0].category,
      images: result.rows[0].imagepath,
    });
  } catch (error) {
    return handleError(res, "Error while getting event", error);
  }
};
