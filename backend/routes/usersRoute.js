import express from "express";
import pool from "../dbConfig.js";
import bcrypt from "bcryptjs";
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
  if (req.user.role !== "user") {
    //test only for user
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    //Get Paged Users List
    const userQuery = await pool.query("SELECT * FROM users");

    //Get Total of all Users
    const totalResult = await pool.query("SELECT COUNT(*) FROM users");
    const total = parseInt(totalResult.rows[0].count, 10);

    //Add x-total-Count
    res.set("X-Total-Count", total);

    const users = userQuery.rows.map((user) => ({
      ...user,
      created_at: new Date(user.created_at).toISOString(), //for adminPage show but timestamp is already correct
    }));
    res.json(users);
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
    const { email, password } = req.body;

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

router.delete("/:id", authenticationToken, async (req, res) => {
  const { id } = req.params;
  //test only
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Forbidden request" });
  }

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, "Error while deleting user", error);
  }
});

export { router as usersRouter };
