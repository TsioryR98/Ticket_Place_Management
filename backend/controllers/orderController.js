// backend/controllers/orderController.js
import pool from "../dbConfig.js";

const handleError = (res, message, error) => {
  console.error(message, error);
  res.status(500).json({ message, error: error?.message || error });
};

// POST /api/orders - Créer une nouvelle commande
export const createOrder = async (req, res) => {
  const userId = req.user?.userId;
  console.log("User ID from token:", req.user?.userId); // Debug
  console.log("Request body:", req.body); // Debug

  if (!req.user?.userId) {
    return res.status(401).json({
      code: "MISSING_AUTH",
      error: "Authentification requise",
    });
  }

  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Items must be an array" });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Calculer le montant total
    const ticketPrices = await Promise.all(
      items.map((item) =>
        client
          .query("SELECT price FROM tickets WHERE ticket_id = $1", [
            item.ticketId,
          ])
          .then((result) => {
            if (result.rows.length === 0) {
              throw new Error(`Ticket ${item.ticketId} not found`);
            }
            return Number(result.rows[0].price) * item.quantity;
          })
      )
    );

    const totalAmount = ticketPrices.reduce((sum, price) => sum + price, 0);

    // 2. Créer la commande
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total_amount, status_order) VALUES ($1, $2, $3) RETURNING *",
      [userId, totalAmount, "pending"]
    );
    const order = orderResult.rows[0];

    // 3. Ajouter les items de la commande
    const orderItems = await Promise.all(
      items.map((item) =>
        client.query(
          "INSERT INTO order_items (order_id, ticket_id, quantity, price) " +
            "VALUES ($1, $2, $3, (SELECT price FROM tickets WHERE ticket_id = $2)) RETURNING *",
          [order.order_id, item.ticketId, item.quantity]
        )
      )
    );

    // 4. Mettre à jour la disponibilité des billets
    await Promise.all(
      items.map((item) =>
        client.query(
          "UPDATE tickets SET available = available - $1 WHERE ticket_id = $2",
          [item.quantity, item.ticketId]
        )
      )
    );

    await client.query("COMMIT");

    res.status(201).json({
      ...order,
      items: orderItems.map((item) => item.rows[0]),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleError(res, "Error creating order", error);
  } finally {
    client.release();
  }
};

// GET /api/orders - Récupérer les commandes de l'utilisateur
export const getUserOrders = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const ordersResult = await pool.query(
      `SELECT 
        o.*,
        oi.order_item_id,
        oi.ticket_id,
        oi.quantity,
        oi.price,
        oi.created_at as item_created_at,
        t.types as ticket_type,
        e.title as event_title,
        e.event_datetime as event_date,
        e.locations as event_location
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN tickets t ON oi.ticket_id = t.ticket_id
      JOIN events e ON t.event_id = e.event_id
      WHERE o.user_id = $1
      ORDER BY e.event_datetime ASC`,
      [userId]
    );

    const ordersMap = new Map();
    ordersResult.rows.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          user_id: row.user_id,
          total_amount: Number(row.total_amount),
          status_order: row.status_order,
          created_at: row.created_at,
          items: [],
        });
      }

      ordersMap.get(row.order_id).items.push({
        order_item_id: row.order_item_id,
        ticket_id: row.ticket_id,
        quantity: row.quantity,
        price: Number(row.price),
        ticket_type: row.ticket_type,
        event_title: row.event_title,
        event_date: row.event_date,
        event_location: row.event_location,
        created_at: row.item_created_at,
      });
    });

    const orders = Array.from(ordersMap.values());
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, "Error fetching orders", error);
  }
};

// GET /api/orders/:orderId - Récupérer une commande spécifique
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?.userId;

  try {
    // Vérifier que l'utilisateur est propriétaire de la commande
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Order not found or access denied" });
    }

    const order = orderResult.rows[0];

    // Récupérer les items de la commande
    const itemsResult = await pool.query(
      "SELECT oi.*, t.types as ticket_type, e.title as event_title " +
        "FROM order_items oi " +
        "JOIN tickets t ON oi.ticket_id = t.ticket_id " +
        "JOIN events e ON t.event_id = e.event_id " +
        "WHERE oi.order_id = $1",
      [orderId]
    );

    res.status(200).json({
      ...order,
      items: itemsResult.rows,
    });
  } catch (error) {
    handleError(res, "Error fetching order", error);
  }
};

// PUT /api/orders/:orderId - ADMIN Mettre à jour le statut (admin seulement)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  // const { role } = req.user;
  // Solution temporaire - bypass auth pour les tests
  const role = "admin"; // Force le rôle admin

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: admin access required" });
  }

  if (!["pending", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await pool.query(
      "UPDATE orders SET status_order = $1 WHERE order_id = $2 RETURNING *",
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    handleError(res, "Error updating order status", error);
  }
};

// cancel the reservation
export const cancelOrderItem = async (req, res) => {
  const { orderId, ticketId } = req.params;
  const userId = req.user.userId; // Extrait du JWT

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Vérifier que l'item appartient bien à l'utilisateur
    const orderCheck = await client.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Commande non trouvée ou accès refusé" });
    }

    // 2. Récupérer la quantité annulée et vérifier la date de l'événement
    const itemResult = await client.query(
      `SELECT oi.quantity, e.event_datetime 
       FROM order_items oi
       JOIN tickets t ON oi.ticket_id = t.ticket_id
       JOIN events e ON t.event_id = e.event_id
       WHERE oi.order_id = $1 AND oi.ticket_id = $2`,
      [orderId, ticketId]
    );

    if (itemResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Billet non trouvé dans la commande" });
    }

    const { quantity, event_datetime } = itemResult.rows[0];
    const eventDate = new Date(event_datetime);
    const currentDate = new Date();

    if (eventDate < currentDate) {
      return res.status(400).json({
        error: "Impossible d'annuler un billet pour un événement passé",
      });
    }

    // 3. Supprimer l'item de la commande
    await client.query(
      "DELETE FROM order_items WHERE order_id = $1 AND ticket_id = $2",
      [orderId, ticketId]
    );

    // 4. Remettre les billets en stock
    await client.query(
      "UPDATE tickets SET available = available + $1 WHERE ticket_id = $2",
      [quantity, ticketId]
    );

    // 5. Mettre à jour le montant total de la commande
    await client.query(
      "UPDATE orders SET total_amount = total_amount - ($1 * (SELECT price FROM tickets WHERE ticket_id = $2)) WHERE order_id = $3",
      [quantity, ticketId, orderId]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "Annulation réussie" });
  } catch (error) {
    await client.query("ROLLBACK");
    handleError(res, "Erreur lors de l'annulation", error);
  } finally {
    client.release();
  }
};

// GET /api/admin/orders - Récupérer TOUTES les commandes (pour admin)
export const getAllOrders = async (req, res) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: admin access required" });
  }

  try {
    const ordersResult = await pool.query(
      `SELECT 
        o.*,
        oi.order_item_id,
        oi.ticket_id,
        oi.quantity,
        oi.price,
        oi.created_at as item_created_at,
        t.types as ticket_type,
        e.title as event_title,
        e.event_datetime as event_date,
        e.locations as event_location,
        u.user_email as user_email
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN tickets t ON oi.ticket_id = t.ticket_id
      JOIN events e ON t.event_id = e.event_id
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC`
    );

    const ordersMap = new Map();
    ordersResult.rows.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          user_id: row.user_id,
          user_email: row.user_email,
          total_amount: Number(row.total_amount),
          status_order: row.status_order,
          created_at: row.created_at,
          items: [],
        });
      }

      ordersMap.get(row.order_id).items.push({
        order_item_id: row.order_item_id,
        ticket_id: row.ticket_id,
        quantity: row.quantity,
        price: Number(row.price),
        ticket_type: row.ticket_type,
        event_title: row.event_title,
        event_date: row.event_date,
        event_location: row.event_location,
        created_at: row.item_created_at,
      });
    });

    const orders = Array.from(ordersMap.values());
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, "Error fetching all orders", error);
  }
};

export const testAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        u.user_email,
        e.title as event_title
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN tickets t ON oi.ticket_id = t.ticket_id
      LEFT JOIN events e ON t.event_id = e.event_id
      GROUP BY o.order_id, u.user_email, e.title
      ORDER BY o.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    handleError(res, "Error testing orders", error);
  }
};

export const getOrdersByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT o.*, u.user_email 
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN tickets t ON oi.ticket_id = t.ticket_id
      JOIN users u ON o.user_id = u.user_id
      WHERE t.event_id = $1
      GROUP BY o.order_id, u.user_email
    `,
      [eventId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    handleError(res, "Error fetching orders by event", error);
  }
};
