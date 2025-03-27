import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

// POST /api/orders - Créer une commande
export const createOrder = async (req, res) => {
  const { userId, items } = req.body;

  if (!items?.length) {
    return res.status(400).json({ error: "Minimum 1 item requis" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Calcul du montant total
    const tickets = await Promise.all(
      items.map((item) =>
        client.query(
          "SELECT price, available FROM tickets WHERE ticket_id = $1 FOR UPDATE",
          [item.ticketId]
        )
      )
    );

    const totalAmount = tickets.reduce((sum, result, index) => {
      if (result.rows.length === 0)
        throw new Error(`Ticket ${items[index].ticketId} introuvable`);
      if (result.rows[0].available < items[index].quantity)
        throw new Error("Stock insuffisant");
      return sum + result.rows[0].price * items[index].quantity;
    }, 0);

    // 2. Création commande (sans statut)
    const order = await client.query(
      "INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *",
      [userId, totalAmount]
    );

    // 3. Ajout des articles + mise à jour stock
    await Promise.all([
      ...items.map((item, index) =>
        client.query(
          "INSERT INTO order_items (order_id, ticket_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [
            order.rows[0].order_id,
            item.ticketId,
            item.quantity,
            tickets[index].rows[0].price,
          ]
        )
      ),
      ...items.map((item, index) =>
        client.query(
          "UPDATE tickets SET available = available - $1 WHERE ticket_id = $2",
          [item.quantity, item.ticketId]
        )
      ),
    ]);

    await client.query("COMMIT");
    res.status(201).json(order.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    handleError(res, "Erreur lors de la commande", error);
  } finally {
    client.release();
  }
};

// GET /api/orders - Récupérer les commandes avec items d'un client
export const getUserOrders = async (req, res) => {
  const userId = req.user?.userId;
  try {
    // 1. Récupérer les commandes de base
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // 2. Pour chaque commande, récupérer les items associés
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query(
          `SELECT 
            oi.order_item_id,
            oi.ticket_id,
            oi.quantity,
            oi.price,
            t.types,
            e.title
           FROM order_items oi
           JOIN tickets t ON oi.ticket_id = t.ticket_id
           JOIN events e ON t.event_id = e.event_id
           WHERE oi.order_id = $1`,
          [order.order_id]
        );

        return {
          ...order,
          items: items.rows,
        };
      })
    );

    res.status(200).json(ordersWithItems);
  } catch (error) {
    handleError(res, "Erreur de récupération", error);
  }
};

/*GET /api/orders/:orderId : Récupérer une commande spécifique */

export const getSelectedOrders = async (req, res) => {
  const userId = req.user?.userId;
  const { orderId } = req.params;

  try {
    // 1. Récupérer les commandes de base
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 AND order_id=$2",
      [userId, orderId]
    );
    // 2. Pour chaque commande, récupérer les items associés
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query(
          `SELECT 
            oi.order_item_id,
            oi.ticket_id,
            oi.quantity,
            oi.price,
            t.types,
            e.title
           FROM order_items oi
           JOIN tickets t ON oi.ticket_id = t.ticket_id
           JOIN events e ON t.event_id = e.event_id
           WHERE oi.order_id = $1`,
          [order.order_id]
        );

        return {
          ...order,
          items: items.rows,
        };
      })
    );
    res.status(200).json(ordersWithItems);
  } catch (error) {
    handleError(res, "Erreur de récupération", error);
  }
};

// DELETE /api/orders/:orderId - Annuler une commande
export const cancelOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Récupère les articles avec verrouillage
    const items = await client.query(
      `SELECT oi.ticket_id, oi.quantity 
       FROM order_items oi
       WHERE oi.order_id = $1 FOR UPDATE`,
      [req.params.orderId]
    );

    // 2. Remet les tickets en stock
    await Promise.all(
      items.rows.map((item) =>
        client.query(
          "UPDATE tickets SET available = available + $1 WHERE ticket_id = $2",
          [item.quantity, item.ticket_id]
        )
      )
    );

    // 3. Supprime la commande (CASCADE supprimera les items)
    await client.query("DELETE FROM orders WHERE order_id = $1", [
      req.params.orderId,
    ]);

    await client.query("COMMIT");
    res.status(204).end();
  } catch (error) {
    await client.query("ROLLBACK");
    handleError(res, "Erreur d'annulation", error);
  } finally {
    client.release();
  }
};
