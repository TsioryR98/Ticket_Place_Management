import express, { json } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routes/userRoutes.js";
import { eventRouter } from "./routes/eventRoute.js";
import { ticketRouter } from "./routes/ticketRoute.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { initWebSocket } from "./websocket/wsServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  origin: process.env.URL || "*",
  exposedHeaders: ["X-Total-Count"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

//route for user
app.use("/api/users", usersRouter);
//route for event
app.use("/api/events", eventRouter);
//route for order
app.use("/api/orders", orderRouter);
//route for ticket
app.use("/api/events", ticketRouter);

const server = app.listen(PORT, () => {
  console.log(`appServer is running on http://localhost:${PORT}`);
});

initWebSocket(server);
