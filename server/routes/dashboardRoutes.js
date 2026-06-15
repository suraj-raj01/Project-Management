import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats, getUsers, getUserById, updateUser, deleteUser, createMember, getAdmins, getUsersByAdmin, getTasksByAdmin, getSuperAdminDashboardStats } from "../controllers/dashboardController.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", protect, rateLimiter, getDashboardStats);
router.get("/superadmin", protect, getSuperAdminDashboardStats);
router.get("/users", protect, rateLimiter, getUsers);
router.get("/admins", protect, getAdmins);
router.post("/users", protect, createMember);
router.get("/users/:id", getUserById);
router.get("/usersbyadmin/:id", getUsersByAdmin);
router.get("/tasks/:id", getTasksByAdmin);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
 
export default router;