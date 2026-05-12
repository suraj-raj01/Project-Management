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

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id",  getProjectById);
router.put("/:id", protect, updateProject);
router.put("/:id/add-member", protect, addMember);
router.delete("/:id",protect, deleteProject);


export default router;