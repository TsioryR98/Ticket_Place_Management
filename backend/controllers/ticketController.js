import pool from '../dbConfig.js';
const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*-------- update /api/events/:eventId/tickets/:ticketId OK ADMIN--------- */
export const updateEventTicket = async (req, res) => {
  const { eventId, ticketId } = req.params;
  const { types, price, available, limitPerPerson } = req.body;
  const { role } = req.user;

  if (role !== 'user') {
    return res.status(403).json({ error: 'Forbidden request' });
  }

  try {
    const query = await pool.query(
      'UPDATE tickets SET types = $1, price = $2, available = $3, limit_per_person = $4 WHERE event_id = $5 AND ticket_id = $6 RETURNING *',
      [types, price, available, limitPerPerson, eventId, ticketId],
    );

    if (query.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket updated successfully', ticket: query.rows[0] });
  } catch (error) {
    handleError(res, 'Error updating the ticket', error);
  }
};
/*-------- DELETE /api/events/:eventId/tickets/:ticketId ADMIN OK--------- */

export const deleteEventTicket = async (req, res) => {
  const { eventId, ticketId } = req.params;
  const { role } = req.user;
  if (role !== 'user') {
    return res.status(403).json({ error: 'Forbidden request' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM tickets WHERE event_id = $1 AND ticket_id = $2 RETURNING *',
      [eventId, ticketId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully', ticket: result.rows[0] });
  } catch (error) {
    handleError(res, 'Error deleting the ticket', error);
  }
};

/*-------- GET /api/events/:eventId/tickets ok --------- */

export const getAllEventsTicket = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tickets WHERE event_id = $1', [eventId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'event not found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    handleError(res, 'Error during fecthing from database', error);
  }
};

/*-------- create /api/events/:eventId/tickets ADMIN ok --------- */

export const createEventTicket = async (req, res) => {
  const { eventId } = req.params;
  const { role } = req.user;
  if (role !== 'user') {
    return res.status(403).json({ error: 'Forbidden request' });
  }
  const { types, price, available, limitPerPerson } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tickets (event_id,types, price, available, limit_per_person) VALUES ($1,$2, $3, $4, $5) RETURNING *',
      [eventId, types, price, available, limitPerPerson],
    );

    res.status(201).json({ ticket: result.rows[0] });
  } catch (error) {
    handleError(res, 'Error creating the ticket', error);
  }
};

/*-------- GET /api/events/:eventId/tickets/:ticketId ok --------- */

export const getEventTicketById = async (req, res) => {
  const { eventId, ticketId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE event_id = $1 AND ticket_id = $2',
      [eventId, ticketId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ ticket: result.rows[0] });
  } catch (error) {
    handleError(res, 'Error fetching the ticket', error);
  }
};
