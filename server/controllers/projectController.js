import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

export const createProject = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;
        if (!name || !description || !createdBy) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findById(createdBy)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userProjects = await Project.find({ createdBy: createdBy });

        if (userProjects.length >= 5 && user.subscription === "Free") {
            return res.status(400).json({ success: false, rollback: "upgrade", message: "Free user can only create 5 projects Upgrade Plan" });
        }

        if (userProjects.length >= 20 && user.subscription === "Basic") {
            return res.status(200).json({ success: false, rollback: "upgrade", message: "Basic user can only create 20 projects Upgrade Plan" });
        }

        const project = await Project.create({
            name,
            description,
            createdBy,
            members: [],
        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({createdBy:req.user._id}).populate("createdBy", "name email")
        if (!projects) {
            return res.status(404).json({ success: false, message: "Projects not found" });
        }
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("createdBy", "name email")
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const { userId } = req.body;

        const project = await Project.findById(req.params.id);

        if (project.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can add members" });
        }

        project.members.push(userId);

        await project.save();

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        await Project.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json({ success: true, message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only creator can delete the project" });
        }

        await project.deleteOne();
        res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};