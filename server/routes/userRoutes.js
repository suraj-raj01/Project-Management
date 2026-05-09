import express from "express";
import User from "../models/userModel.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    const users = await User.find().select("-password");

    res.status(200).json({
        users,
    });
});

export default router;