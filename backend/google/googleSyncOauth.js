import pool from '../dbConfig.js';
import { jwTokenAuth } from '../utils/jwt_auth.js';

const handleError = (res, message, error) => {
  res.status(500).json({ message, error: error?.message || error });
};

const googleOauth = async (req, res) => {
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
          'INSERT INTO users (user_name, user_email, role, user_passwords) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, email, 'user', 'OAUTH_GOOGLE_ACCOUNT'],
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

    return res.json({
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role: user.role,
      },
    });
  } catch (error) {
    return handleError(res, 'Error during Google authentication', error);
  }
};

export default googleOauth;
