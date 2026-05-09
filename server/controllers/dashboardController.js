import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

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

        res.json({
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            overdueTasks,
            tasksPerUser
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
