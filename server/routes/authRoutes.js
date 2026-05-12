import express from "express";
import { changePassword, loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword)

export default router;