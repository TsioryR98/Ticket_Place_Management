import {
  getAllUsers,
  registerUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";
import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticationToken, getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);

export { router as usersRouter };
