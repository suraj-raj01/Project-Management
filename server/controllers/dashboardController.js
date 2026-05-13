import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Project from '../models/projectModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const todoTasks = await Task.countDocuments({
            status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
            status: "In Progress",
        });
        const doneTasks = await Task.countDocuments({
            status: "Completed",
        });
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" || "Pending"},
        });
        const tasksPerUser = await Task.aggregate([
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: {
                        $sum: 1,
                    },
                },
            },
        ]);

        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();

        res.json({
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            overdueTasks,
            tasksPerUser,
            totalUsers,
            totalProjects,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({users, success: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user, success: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {
            name,
            email,
            role,
        }, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message:'User updated successfully', user, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};