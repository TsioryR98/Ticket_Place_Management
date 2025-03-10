import express from "express";
import pool from "../dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const router = express.Router();

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

router.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
});

router.post("/register", async (req, res) => {
  try {
    //body request
    const { username, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_passwords) VALUES($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    handleError(res, "Error during insert into database:", error);
  }
});

export { router as usersRouter };
