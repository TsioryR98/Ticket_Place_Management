import express from "express";
import pool from "../dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { error } from "console";
import { jwTokenAuth } from "../utils/jwt_auth.js";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

{
  /*Get LIST OF USER for admin role only*/
}
router.get("/", authenticationToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden request" });
  }
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
    //JWT token for routes and add in cookies refresh tokens

    let tokens = jwTokenAuth(users.rows[0]);

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true, //just server but not client
      secure: true, //only with https request
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, //milliseconds
    });

    res.json(tokens);
  } catch (error) {
    handleError(res, "Error during connection", error);
  }
});

export { router as usersRouter };
