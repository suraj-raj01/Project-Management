import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats, getUsers, getUserById, updateUser, deleteUser, createMember, getAdmins, getUsersByAdmin, getTasksByAdmin, getSuperAdminDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);
router.get("/superadmin", protect, getSuperAdminDashboardStats);
router.get("/users", protect, getUsers);
router.get("/admins", protect, getAdmins);
router.post("/users", protect, createMember);
router.get("/users/:id", getUserById);
router.get("/usersbyadmin/:id", getUsersByAdmin);
router.get("/tasks/:id", getTasksByAdmin);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
 
export default router;