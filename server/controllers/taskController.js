import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

export const createTask = async (req, res) => {
    try {
        const { project, title, description, assignedTo, dueDate, priority, createdBy } = req.body;
        const proj = await Project.findById(project);
        console.log(req.body);

        if (!proj) {
            return res.status(404).json({ message: "Project not found", success: false });
        }

        let userTasks = await Task.find({ createdBy: createdBy });
        const user = await User.findById(createdBy);

        // Plan Limits
        const planLimits = {
            Free: {
                projects: 5,
                tasks: 10
            },
            Basic: {
                projects: 20,
                tasks: 100
            },
            Pro:{
                projects: 1000,
                tasks: 10000
            }
        };

        const limit = planLimits[user.subscription] || planLimits.Free;

        // Project limit check
        const userProjects = await Project.find({ createdBy: user._id });
        if (userProjects.length > limit.projects) {
            return res.status(400).json({ success: false, rollback: "upgrade", message: `Upgrade Plan: Max ${limit.projects} projects allowed` });
        }

        // Task limit check
        if (userTasks.length >= limit.tasks) {
            return res.status(400).json({ success: false, rollback: "upgrade", message: `Upgrade Plan: Max ${limit.tasks} tasks allowed` });
        }

        const task = await Task.create({
            project,
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            createdBy,
            status:"Pending",
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({createdBy:req.user._id}).populate("assignedTo").populate("project").sort({ createdAt: -1 })
        res.status(200).json({ tasks, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.query.userId }).populate("assignedTo", "name email").populate("project", "name description").sort({ createdAt: -1 })
        res.status(200).json({ tasks, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("project", "name description").sort({ createdAt: -1 })

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const data = req.body;
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await Task.findByIdAndUpdate(req.params.id, { ...data, status: data.status }, { new: true });
        res.status(200).json({ message: "Task status updated", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};