import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Project from '../models/projectModel.js';
import bcrypt from "bcryptjs";

export const getDashboardStats = async (req, res) => {
    try {
        console.log(req.body)
        const totalTasks = await Task.find({createdBy: req.user._id}).countDocuments();
        const todoTasks = await Task.find({createdBy: req.user._id}).countDocuments({
            status: "Pending",
        });
        const inProgressTasks = await Task.find({createdBy: req.user._id}).countDocuments({
            status: "In Progress",
        });
        const doneTasks = await Task.find({createdBy: req.user._id}).countDocuments({
            status: "Completed",
        });
        const overdueTasks = await Task.find({createdBy: req.user._id}).countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" || "Pending" },
        });
        const tasksPerUser = await Task.aggregate([
            {
                $match: {
                    createdBy: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: {
                        $sum: 1,
                    },
                },
            },
        ])

        const totalUsers = await User.find({createdBy: req.user._id}).countDocuments();
        const totalProjects = await Project.find({createdBy: req.user._id}).countDocuments();

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

export const getSuperAdminDashboardStats = async (req, res) => {
    try {
        console.log(req.body)
        const totalTasks = await Task.find().countDocuments();
        const todoTasks = await Task.find().countDocuments({
            status: "Pending",
        });
        const inProgressTasks = await Task.find().countDocuments({
            status: "In Progress",
        });
        const doneTasks = await Task.find().countDocuments({
            status: "Completed",
        });
        const overdueTasks = await Task.find().countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" || "Pending" },
        });
        const tasksPerUser = await Task.aggregate([
            {
                $match: {
                    createdBy: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: {
                        $sum: 1,
                    },
                },
            },
        ])

        const totalUsers = await User.find().countDocuments();
        const totalMembers = await User.find({role: "Member"}).countDocuments();
        const totalAdmins = await User.find({role: "Admin"}).countDocuments();
        const totalProjects = await Project.find().countDocuments();

        res.json({
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            overdueTasks,
            tasksPerUser,
            totalUsers,
            totalMembers,
            totalAdmins,
            totalProjects,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ createdBy: req.user._id }).select("-password");
        // console.log(users)
        res.status(200).json({ users, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsersByAdmin = async (req, res) => {
    try {
        const users = await User.find({ createdBy: req.params.id }).select("-password");
        // console.log(users)
        res.status(200).json({ users, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByAdmin = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.params.id });
        // console.log(tasks)
        res.status(200).json({ tasks, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password").populate("createdBy", "name");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user, success: true });
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

        res.status(200).json({ message: 'User updated successfully', user, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: 'User deleted successfully', user, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMember = async (req, res) => {
    try {
        const { name, email, password, createdBy, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const planLimits = {
            Free: {
                users: 5
            },
            Basic: {
                users: 20
            },
            Pro:{
                users: 1000
            }
        };

        const limit = planLimits[user.subscription] || planLimits.Free;

        // user limit check
        const Users = await User.find({ createdBy: user._id });
        if (Users.length >= limit.users) {
            return res.status(400).json({ success: false, rollback: "upgrade", message: `Upgrade Plan: Max ${limit.users} users allowed` });
        }
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "Member",
            subscriptionEndDate: subscriptionEndDate.toISOString(),
            createdBy,
        });

        res.status(201).json({
            newUser,
            success:true,
            message:"User created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get admins
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({
            role: "Admin",
        }).select("-password").sort({ createdAt: -1 })
        // console.log(users)
        res.status(200).json({ admins, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
