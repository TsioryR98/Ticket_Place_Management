import {
  getAllUsers,
  registerUser,
  deleteUser,
  loginUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticationToken, getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:userId", authenticationToken, deleteUser);
router.get("/me", authenticationToken, getUser);
router.put("/me", authenticationToken, updateUser);

export { router as usersRouter };
