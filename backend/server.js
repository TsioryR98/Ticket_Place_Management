import express, { json } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
//import { usersRouter } from "../backend/routes/userRoutes.js";
import { usersRouter } from "../backend/routes/userRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); //static files

const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
  origin: "http://localhost:5173", //allow front and backend => ["..",".."]by CORS and replace during deployement
  credentials: true,
  exposedHeaders: ["X-Total-Count"], //allow cors to expose X-Total-Count
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

//route for user test only
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`appServer is running on http://localhost:${PORT}`);
});
