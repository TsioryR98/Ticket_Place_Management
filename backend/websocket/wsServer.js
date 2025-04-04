import { WebSocketServer } from "ws";

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        if (data.action === "subscribe" && data.eventId) {
          ws.eventId = data.eventId;
          ws.send(
            JSON.stringify({
              status: "subscribed",
              eventId: data.eventId,
            })
          );
          console.log(`Client subscribed to event ${data.eventId}`);
        }
      } catch (error) {
        console.error("Invalid message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
};

export const broadcastToEventClients = (eventId, message) => {
  console.log(`[WS] Broadcasting to event ${eventId}`, message);

  if (!wss) {
    console.error("[WS] Server not initialized");
    return;
  }

  const data = JSON.stringify({
    eventId,
    type: "STOCK_UPDATE",
    data: message,
  });

  let sentCount = 0;
  wss.clients.forEach((client) => {
    console.log(
      `[WS] Client state: ${client.readyState}, subscribed to: ${client.eventId}`
    );
    if (client.readyState === 1 && client.eventId === eventId) {
      client.send(data);
      sentCount++;
      console.log(`[WS] Sent to client ${client._socket.remoteAddress}`);
    }
  });

  console.log(`[WS] Total notified: ${sentCount}`);
};
