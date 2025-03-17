import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
function jwTokenAuth({ user_id, user_email, role }) {
  //payload : included inside the tokens
  const payload = {
    userId: user_id,
    email: user_email,
    role: role,
  };
  //access token and time
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  //refresh token and time
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}
export { jwTokenAuth };
