import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats, getUsers, getUserById, updateUser } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboardStats);
router.get("/users", protect, getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", protect, updateUser);

export default router;