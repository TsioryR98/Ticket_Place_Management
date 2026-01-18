/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import ms from 'ms';

/*------POST api/users/refresh SIGN tokens instead of User----------- */

export const refreshTokenAccess = (req, res) => {
  const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Access Denied. No refresh token provided.',
    });
  }
  try {
    const decodedUserRefreshed = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      {
        userId: decodedUserRefreshed.userId,
        role: decodedUserRefreshed.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    const expiresAt = Math.floor(Date.now() + ms(process.env.JWT_EXPIRES_IN));

    return res.status(200).json({ accessToken, expiresAt: expiresAt });
  } catch (error) {
    console.error('Refresh token error:', error?.message || error);
    return res.status(403).json({
      error: 'Invalid or expired refresh token',
    });
  }
};
