import express from "express";
import protect from "../middlewares/authMiddleware.js";
import Project from "../models/projectModel.js";
import {
    addMember,
    createProject,
    getProjects,
    getProjectById,
    updateProject
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id",  getProjectById);
router.put("/:id", protect, updateProject);
router.put("/:id/add-member", protect, addMember);
router.delete("/:id", protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;