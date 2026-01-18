import pool from "../dbConfig.js";
import bcrypt from "bcryptjs";
import { jwTokenAuth } from "../utils/jwt_auth.js";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

/*--------get all user only ADMIN--------- */

export const getAllUsers = async (req, res) => {
  //user JWT

  if (req.user.role !== "admin") {
    //test only for user
    return res.status(403).json({ error: "Forbidden request" });
  }
  try {
    //Get Paged Users List  //Get Total of all Users
    const { page = 1, perPage = 10 } = req.query;
    const offset = (page - 1) * perPage;

    const [userQuery, totalResult] = await Promise.all([
      pool.query("SELECT * FROM users ORDER BY created_at LIMIT $1 OFFSET $2", [
        perPage,
        offset,
      ]),
      pool.query("SELECT COUNT(*) FROM users"),
    ]);
    const total = parseInt(totalResult.rows[0].count, 10);

    //Add x-total-Count
    res.set("X-Total-Count", total);

    const users = userQuery.rows.map((user) => ({
      ...user,
      created_at: new Date(user.created_at).toISOString(), //for adminPage show but timestamp is already correct
    }));
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, "Error during fecthing from database", error);
  }
};

/*--------register an user POST api/users/register USER--------- */
export const registerUser = async (req, res) => {
  try {
    //body request
    const { username, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_passwords) VALUES($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    return res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    return handleError(res, "Error during insert into database:", error);
  }
};

/*--------authenticate an user POST api/users/login  USER--------- */

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
    //JWT token for routes a

    let tokens = jwTokenAuth(users.rows[0]);

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: true, //only with https request
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //milliseconds
    });

    return res.json({
      token: tokens.accessToken,
      expiresAt: tokens.expiresAt,
      user: {
        user_id: users.rows[0].user_id,
        user_name: users.rows[0].user_name,
        user_email: users.rows[0].user_email,
        role: users.rows[0].role,
      },
    });
  } catch (error) {
    return handleError(res, "Error during connection", error);
  }
};

/*-------delete an user GET /api/users/:id/delete  ADMIN--------- */

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  if (role !== "admin") {
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

    await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return handleError(res, "Error while deleting user", error);
  }
};

/*-------get one user  GET /api/users/me  USER --------- */

export const getUser = async (req, res) => {
  const userId = req.user?.userId; //jwt key
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id =$1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];

    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, "Error while getting user", error);
  }
};

//*-----------------PATCH /api/users/me/settings user only--------------------*/
export const updateUser = async (req, res) => {
  const userId = req.user?.userId; // JWT
  const { username, email, password, oldPassword } = req.body;

  try {
    //Check if there is no info sent
    if (!username && !email && !password) {
      return res.status(400).json({ error: "No updates provided" });
    }
    //params for request
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    if (username) {
      updateFields.push(`user_name = $${paramIndex}`);
      queryParams.push(username);
      paramIndex++;
    }

    if (email) {
      updateFields.push(`user_email = $${paramIndex}`);
      queryParams.push(email);
      paramIndex++;
    }

    if (password) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ error: "Old password is required to update password" });
      }

      // Check current password
      const userQuery = await pool.query(
        "SELECT user_passwords FROM users WHERE user_id = $1",
        [userId]
      );
      const user = userQuery.rows[0];
      const passwordMatch = await bcrypt.compare(
        oldPassword,
        user.user_passwords
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect old password" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`user_passwords = $${paramIndex}`);
      queryParams.push(hashedPassword);
      paramIndex++;
    }

    queryParams.push(userId);

    const queryText = `
      UPDATE users 
      SET ${updateFields.join(", ")} 
      WHERE user_id = $${paramIndex} 
      RETURNING *
    `;

    const query = await pool.query(queryText, queryParams);

    if (query.rows.length === 0) {
      return res.status(404).json({ error: "User not found " });
    }

    const user = query.rows[0];
    delete user.user_passwords;

    return res.status(200).json({
      message: "update successfully",
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  } catch (error) {
    return handleError(res, "Error during update", error);
  }
};

/*-----------------PATCH /api/users/role/:id for admin only--------------------*/

export const updateUserRole = async (req, res) => {
  const { id } = req.params; // User ID from the route parameter
  const { role } = req.body; // New role from the request body
  const { role: currentUserRole } = req.user; // Current user's role from JWT

  if (currentUserRole !== "user") {
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

    const query = await pool.query(
      "UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *",
      [role, id]
    );

    return res
      .status(200)
      .json({ message: "User role updated successfully", user: query.rows[0] });
  } catch (error) {
    return handleError(res, "Error while updating user role", error);
  }
};

/*-----------------GET /api/users/:id for admin side only --------------------*/
export const getUserById = async (req, res) => {
  const { id } = req.params; // User ID from the route parameter
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id =$1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];

    //format response for admin
    return res.status(200).json({
      id: user.user_id,
      username: user.user_name,
      email: user.user_email,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    return handleError(res, "Error while getting user", error);
  }
};
