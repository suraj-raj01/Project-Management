import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats, getUsers, getUserById, updateUser, deleteUser, createMember } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);
router.get("/users", protect, getUsers);
router.post("/users", protect, createMember);
router.get("/users/:id", getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
 
export default router;