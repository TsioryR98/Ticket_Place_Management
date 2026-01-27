// POST /api/orders/:orderId/validate
import pool from '../dbConfig.js';
import QRcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/email.js';
import { orderConfirmedTemplate } from '../utils/emailtemplate/confirmedOrderEmail.js';

const handleError = (res, message, error) => {
  console.error(message, error);
  res.status(500).json({ message, error: error?.message || error });
};

export const validateOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.user_id; //payload from jwt
  const role = req.user.role;

  if (!req.user?.userId) {
    return res.status(401).json({
      code: 'MISSING_AUTH',
      error: 'Authentification requise',
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    //Check if order exist

    const orderRes = await client.query('SELECT * FROM orders WHERE order_id=$1', [orderId]);

    if (orderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRes.rows[0];

    //Only admin or the user who made the order can validate
    if (role !== 'admin' && order.user_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Forbidden request' });
    }

    const orderItemsRes = await client.query('SELECT * FROM order_items WHERE order_id=$1', [
      orderId,
    ]);

    if (orderItemsRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No items found for this order' });
    }
    const orderItems = orderItemsRes.rows;

    //Generate QR codes for each item
    const OrderWithQrCodes = [];
    for (const item of orderItems) {
      const ticketToken = uuidv4(); //generate unique token for ticket
      const qrData = await QRcode.toDataURL(ticketToken);

      await client.query('UPDATE order_items SET ticket_token = $1 WHERE order_item_id = $2', [
        ticketToken,
        item.order_item_id,
      ]);

      OrderWithQrCodes.push({
        ticket_id: item.order_item_id,
        event_id: item.event_id,
        quantity: item.quantity,
        qrCode: qrData,
      });
    }

    //Commit transaction
    await client.query('UPDATE orders SET status_order=$1 WHERE order_id=$2 RETURNING *', [
      'completed',
      orderId,
    ]);

    const userResult = await pool.query(
      'SELECT user_email, user_name FROM users WHERE user_id = $1',
      [order.user_id],
    );
    const user = userResult.rows[0];
    //same as correct params in orderconfirmedTemplate
    let htmlContent = orderConfirmedTemplate({
      userName: user.user_name,
      orderId,
      tickets: OrderWithQrCodes,
    });

    await sendEmail({
      to: user.user_email,
      subject: 'Your tickets are here!',
      html: htmlContent,
    });

    await client.query('COMMIT');
    res.status(200).json({
      message: 'orders validated',
      order_id: orderId,
      tickets: OrderWithQrCodes,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    handleError(res, 'Error validating order', error);
  } finally {
    client.release();
  }
};
