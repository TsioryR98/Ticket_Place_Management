import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*-----  POST /api/orders/:orderId/items USER add items in order ------- */

export const addItemForOrder = async (req, res) => {
  const userId = req.user?.userId;
  const { orderId } = req.params;
  const { ticketId, quantity } = req.body;

  try {
    const client = await pool.connect();
    //verify user exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    //order check if it is owned by user
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Order not found or not owned by user" });
    }

    try {
      await client.query("BEGIN");
      //find ticket
      const ticketAvailabilty = await client.query(
        "SELECT available, price, limit_per_person FROM tickets WHERE ticket_id = $1 FOR UPDATE",
        [ticketId]
      );

      if (ticketAvailabilty.rows[0].length === 0) {
        throw new Error("ticket not found");
      }
      //response for ticket
      const { available, price, limit_per_person } = ticketAvailabilty.rows[0];

      //check avalaible ticket with quantity in order_items
      if (available < quantity) {
        throw new Error("No more available tickets");
      }

      // check total items for each tickets in order
      const existingItem = await client.query(
        "SELECT SUM(quantity) as total FROM order_items WHERE order_id = $1 AND ticket_id = $2",
        [orderId, ticketId]
      );

      const totalQuantityItem = (existingItem.rows[0].total || 0) + quantity;

      if (totalQuantityItem > limit_per_person) {
        throw new Error(
          `a limit of ${limit_per_person} person/ticket reached `
        );
      }
      // insert order items inside order

      const newItemForOrder = await client.query(
        "INSERT INTO order_items (order_id, ticket_id, quantity, price)  VALUES ($1,$2, $3, $4)RETURNING *",
        [orderId, ticketId, quantity, price]
      );

      //updateAvailableTicket
      await client.query(
        "UPDATE tickets SET available = available - $1 WHERE ticket_id=$2",
        [quantity, ticketId]
      );

      //updateOrderAmount
      await client.query(
        "UPDATE orders SET total_amount = total_amount-$1 WHERE order_id = $2",
        [quantity * price, orderId]
      );

      await client.query("COMMIT");
      res.status(200).json({
        message: "Item added to order",
        item: newItemForOrder.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    handleError(res, "Error during adding item into order", error);
  }
};

/**  ------GET api/orders/:orderId/items USER------- */

export const getOrderItems = async (req, res) => {
  const userId = req.user?.userId;
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.ticket_id,
        t.types as ticket_type,
        oi.quantity,
        oi.price,
        oi.created_at
      FROM order_items oi
      LEFT JOIN tickets t ON oi.ticket_id = t.ticket_id
      WHERE oi.order_id = $1 AND oi.order_id IN (SELECT order_id FROM orders WHERE user_id = $2)`,
      [orderId, userId]
    );

    if (result.rows[0].length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order items", items: result.rows });
  } catch (error) {
    handleError(res, "Erreur de récupération", error);
  }
};

/*-------PUT /api/orders/:orderId/items/:itemId  -------*/

export const updateOrderItem = async (req, res) => {};
