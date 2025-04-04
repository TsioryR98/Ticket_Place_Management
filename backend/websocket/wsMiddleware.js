export const wsEventRoom = (ws, req) => {
  const { eventId } = req.params;
  ws.eventId = eventId;
};
