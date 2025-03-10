import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { error } from "console";

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"]; //not null in const token
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access not allowed" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decodedUser; //user from JWT
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
}

export { authenticationToken };
