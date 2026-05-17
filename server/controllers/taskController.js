import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user._id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo").populate("project").sort({createdAt: -1})
        res.status(200).json({tasks, success: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.query.userId}).populate("assignedTo", "name email").populate("project", "name description").sort({createdAt: -1})
        res.status(200).json({tasks, success: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("project", "name description").sort({createdAt: -1})

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({task, success: true});
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
        await Task.findByIdAndUpdate(req.params.id, {...data, status: data.status }, { new: true });
        res.status(200).json({message: "Task status updated", success: true});
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