import Project from "../models/projectModel.js";

export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description,
            admin: req.user._id,
            members: [req.user._id],
        });

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user._id,
        }).populate("members", "name email");

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        // const project = await Project.findById(req.params.id).populate("members", "name email");
        const project = await Project.findById(req.params.id)

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
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (project.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can update the project" });
        }
        project.name = name || project.name;
        project.description = description || project.description;
        await project.save();
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};