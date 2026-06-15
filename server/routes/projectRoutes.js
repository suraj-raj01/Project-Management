import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
    addMember,
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} from "../controllers/projectController.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/", protect, rateLimiter, createProject);
router.get("/", protect, rateLimiter, getProjects);
router.get("/:id", protect, rateLimiter, getProjectById);
router.put("/:id", protect, rateLimiter, updateProject);
router.put("/:id/add-member", protect, rateLimiter, addMember);
router.delete("/:id", protect, rateLimiter, deleteProject);


export default router;