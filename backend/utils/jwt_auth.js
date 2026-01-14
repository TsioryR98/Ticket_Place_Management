/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ms from "ms";

dotenv.config();
function jwTokenAuth({ user_id, user_email, role }) {
  try {
    //payload : included inside the tokens
    const payload = {
      userId: user_id,
      email: user_email,
      role: role,
    };

    const expiresAt = Date.now() + ms(process.env.JWT_EXPIRES_IN);

    //access token and time
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    //refresh token and time
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken, expiresAt };
  } catch (error) {
    throw new Error(error?.message || error);
  }
}
export { jwTokenAuth };
