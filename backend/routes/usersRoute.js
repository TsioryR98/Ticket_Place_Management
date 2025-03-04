import express from "express";
import pool from "../dbConfig.js";

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

export { router as usersRouter };
