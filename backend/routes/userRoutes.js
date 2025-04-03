import {
  getAllUsers,
  registerUser,
  deleteUser,
  loginUser,
  getUser,
  updateUser,
  getUserById,
  updateUserRole,
} from "../controllers/userController.js";
import express from "express";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticationToken, getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id/delete", authenticationToken, deleteUser);
router.get("/:id", getUserById);
router.get("/me", authenticationToken, getUser);
router.patch("/me/settings", authenticationToken, updateUser);
router.patch("/role/:id", authenticationToken, updateUserRole);

export { router as usersRouter };
