import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
function authenticationToken(res, req, next) {
  const auhtHeader = req.headers["authorization"]; //not null in const token
  const token = auhtHeader && auhtHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acces not allower" });
  if (token === null) return res.status(401).json({ message: "token is null" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(403).json({ message: "invalid token" });
  }
}

export { authenticationToken };
