import express from "express";
import pool from "../dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { error } from "console";
dotenv.config();

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};
const router = express.Router();
//authentication router
router.post("/login", async (req, res) => {
  try {
    //check connection with email or username
    const { username, email, password } = req.body;

    const users = await pool.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);
    if (users.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "this email doesn't have any account" });
    }

    //check password
    const correctPassword = await bcrypt.compare(
      password,
      users.rows[0].user_passwords
    );
    if (!correctPassword) {
      return res.status(401).json({ error: "incorrect password" });
    }
    res.status(200).json("succes");
  } catch (error) {
    handleError(res, "Error during connection", error);
  }
});

export { router as authRouter };
