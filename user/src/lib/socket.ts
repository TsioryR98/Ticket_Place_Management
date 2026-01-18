import { useEffect, useState } from 'react';

export const useSocket = (eventId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [stock, setStock] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: 'subscribe',
          eventId,
        }),
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'STOCK_UPDATE') {
        setStock((prev) => ({
          ...prev,
          [data.data.ticketType]: data.data.available,
        }));
      }
    };

    setSocket(ws);

    return () => ws.close();
  }, [eventId]);

  return { socket, stock };
};
