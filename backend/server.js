import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { usersRouter } from './routes/userRoutes.js';
import { eventRouter } from './routes/eventRoute.js';
import { ticketRouter } from './routes/ticketRoute.js';
import { orderRouter } from './routes/orderRoutes.js';
import { initWebSocket } from './websocket/wsServer.js';

const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  //origin: process.env.URL || "*",
  exposedHeaders: ['X-Total-Count'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//route for user
app.use('/api/users', usersRouter);
//route for event
app.use('/api/events', eventRouter);
//route for order
app.use('/api/orders', orderRouter);
//route for ticket
app.use('/api/events', ticketRouter);
//route for token refresh
app.use('/api/users/refresh', usersRouter);

const server = app.listen(PORT, () => {
  console.log(`appServer is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.status(200).send(`appServer is running on http://localhost:${PORT}`);
});

initWebSocket(server);
