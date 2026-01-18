import {
  getAllUsers,
  registerUser,
  deleteUser,
  loginUser,
  getUser,
  updateUser,
  getUserById,
  updateUserRole,
} from '../controllers/userController.js';
import express from 'express';
import { authenticationToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticationToken, getAllUsers); //admin
router.post('/register', registerUser); //next
router.post('/login', loginUser); //next
router.delete('/:id/delete', authenticationToken, deleteUser); //admin
router.get('/:id', getUserById); //
router.get('/me', authenticationToken, getUser); //next
router.patch('/me/settings', authenticationToken, updateUser); //next
router.patch('/role/:id', authenticationToken, updateUserRole); //admin

export { router as usersRouter };
