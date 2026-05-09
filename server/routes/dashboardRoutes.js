import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats, getUsers } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);
router.get("/users", protect, getUsers);

export default router;