import pool from "../dbConfig.js";
import bcrypt from "bcryptjs";
import { jwTokenAuth } from "../utils/jwt_auth.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all events GET /api/events --------- */
