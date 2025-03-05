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

router.post("/", async (req, res) => {
  try {
    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_passwords, created_at) VALUES($1,$2,$3,$4) RETURNING *",
      [req.name, req.email, req.hashedPassword, req.date]
    );
  } catch (error) {}
});

export { router as usersRouter };
