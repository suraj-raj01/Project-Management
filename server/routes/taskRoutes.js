import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTaskStatus,
    getAllTasks, getTaskById
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", getTasks);
router.get("/all", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

export default router;