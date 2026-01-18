import express from "express";
import { refreshTokenAccess } from "../controllers/userTokenController.js";
const router = express.Router();

router.post("/refresh", refreshTokenAccess); //next

export { router as usersTokenRouter };
