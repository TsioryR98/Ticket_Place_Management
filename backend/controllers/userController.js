import pool from "../dbConfig.js";
import bcrypt from "bcryptjs";
import { jwTokenAuth } from "../utils/jwt_auth.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all user for admin only --------- */

export const getAllUsers = async (req, res) => {
  //user JWT
  if (req.user.role !== "user") {
    //test only for user
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    //Get Paged Users List  //Get Total of all Users

    const [userQuery, totalResult] = await Promise.all([
      pool.query("SELECT * FROM users*"),
      pool.query("SELECT COUNT(*) FROM users"),
    ]);
    const total = parseInt(totalResult.rows[0].count, 10);

    //Add x-total-Count
    res.set("X-Total-Count", total);

    const users = userQuery.rows.map((user) => ({
      ...user,
      created_at: new Date(user.created_at).toISOString(), //for adminPage show but timestamp is already correct
    }));
    res.status(200).json(users);
  } catch (error) {
    handleError(res, "Error during fecthing from database", error);
  }
};

/*--------register an user POST api/users/register--------- */
export const registerUser = async (req, res) => {
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
};

/*--------authenticate an user POST api/users/login--------- */

export const loginUser = async (req, res) => {
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

    res.json({
      tokens,
      user: users.rows[0],
    });
  } catch (error) {
    handleError(res, "Error during connection", error);
  }
};

/*-------delete an user GET /api/users/delete/:id --------- */

export const deleteUser = async (req, res) => {
  const userId = req.user.userId;
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Forbidden request" });
  }

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [
      userId,
    ]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, "Error while deleting user", error);
  }
};

/*-------get one user  GET /api/users/me  --------- */

export const getUser = async (req, res) => {
  const userId = req.user.userId; //jwt key
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id =$1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (error) {
    handleError(res, "Error while getting user", error);
  }
};
