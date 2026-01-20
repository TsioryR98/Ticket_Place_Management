import pool from '../dbConfig';
import { jwTokenAuth } from '../utils/jwt_auth';

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    const providerRes = await pool.query(
      'SELECT u.* FROM users u JOIN user_providers p ON u.user_id = p.user_id WHERE p.provider_name=$1 AND p.provider_account_id=$2',
      ['google', googleId],
    );

    let user = providerRes.rows[0]; //User found via providerRes by googleId

    if (!user) {
      const userRes = await pool.query('SELECT * FROM users WHERE user_email=$1', [email]);
      user = userRes.rows[0];

      if (user) {
        await pool.query(
          'INSERT INTO user_providers (user_id, provider_name, provider_account_id) VALUES ($1, $2, $3)',
          [user.user_id, 'google', googleId],
        );
      } else {
        const newUserRes = await pool.query(
          'INSERT INTO users (user_name, user_email, role) VALUES ($1, $2, $3) RETURNING *',
          [name, email, 'user'],
        );
        user = newUserRes.rows[0];

        await pool.query(
          'INSERT INTO user_providers (user_id, provider_name, provider_account_id) VALUES ($1, $2, $3)',
          [user.user_id, 'google', googleId],
        );
      }
    }

    const tokens = jwTokenAuth({
      user_id: user.user_id,
      user_email: user.user_email,
      role: user.role,
    });

    /** test * return res.json(
     * { accessToken: tokens.accessToken,
     *  user: {
     * user_id: user.rows[0].user_id,
     * user_name: user.rows[0].user_name,
     *  user_email: user.rows[0].user_email,
     * role: user.rows[0].role, },
     * }); */

    return res.json({ user, tokens });
  } catch (error) {
    return handleError(res, 'Error during Google authentication', error);
  }
};
export default googleAuth;
