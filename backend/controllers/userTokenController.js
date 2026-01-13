import { jwTokenAuth } from "../utils/jwt_auth.js";
import jwt from "jsonwebtoken";

/*------POST api/users/refresh SIGN tokens instead of User----------- */

export const refreshTokenAccess = (req, res) => {
  const refreshToken = req.cookies.refresh_token; // const refreshToken = req.cookies['refreshToken']; from the cookies named refresh_token HTTPS ONLY
  if (!refreshToken) {
    return res.status(401).json({
      message: "Access Denied. No refresh token provided.",
    });
  }
  try {
    const decodedUserRefreshed = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    const accesToken = jwt.sign(
      {
        userId: decodedUserRefreshed.userId,
        role: decodedUserRefreshed.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const expiresIn = 3600;

    return res.status(200).json({ accesToken, expiresIn });
  } catch (error) {
    return res.status(400).json({ message, error: error?.message || error });
  }
};
