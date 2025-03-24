import express, { json } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routes/userRoutes.js";
import { eventRouter } from "./routes/eventRoute.js";
import { ticketRouter } from "./routes/ticketRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); //static files

const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"], //allow front and backend => ["..",".."]by CORS and replace during deployement
  credentials: true,
  origin: process.env.URL || "*",
  exposedHeaders: ["X-Total-Count"], //allow cors to expose X-Total-Count
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

//route for user
app.use("/api/users", usersRouter);
//route for event
app.use("/api/events", eventRouter);
//route for ticket
app.use("/api/events", ticketRouter);


app.listen(PORT, () => {
  console.log(`appServer is running on http://localhost:${PORT}`);
});
