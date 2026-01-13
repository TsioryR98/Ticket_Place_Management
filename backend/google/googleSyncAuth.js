import pool from "../dbConfig";

import { jwTokenAuth } from "../utils/jwt_auth";

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    const res = await pool.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);
    let user = res.rows[0];
    if (user) {
      //updating DB
      if (!user.google_id) {
        const updatedUser = await pool.query(
          "UPDATE users SET google_id=$1 WHERE user_id=$2 RETURNING *",
          [googleId, user.user_id]
        );
        user = updatedUser.rows[0];
      }
    } else {
      //insert into DB
      const newUser = await pool.query(
        "INSERT INTO users (user_name, user_email, google_id) VALUES($1, $2, $3) RETURNING *",
        [name, email, googleId]
      );
      user = newUser.rows[0];
    }
    const tokens = jwTokenAuth({
      user_id: user.user_id,
      user_email: user.user_email,
      role: user.role,
    });

    return res.json({
      user,
      tokens,
    });

    /** test 
     *     return res.json({
      accessToken: tokens.accessToken,
      user: {
        user_id: user.rows[0].user_id,
        user_name: user.rows[0].user_name,
        user_email: user.rows[0].user_email,
        role: user.rows[0].role,
      },
    });
     */
  } catch (error) {
    return handleError(res, "Error during Google authentication", error);
  }
};
