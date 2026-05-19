import Discussion from "../models/discussionModel.js";
import User from "../models/userModel.js";

export const createDiscussion = async (req, res) => {
    try {
        const { title, description, postedBy } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const discussion = await Discussion.create({
            title,
            description,
            createdBy: postedBy,
        });

        res.status(201).json({
            success: true,
            message: "Discussion created successfully",
            discussion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllDiscussions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let adminId;

        // If logged-in user is admin
        if (req.user.role === "admin") {
            adminId = req.user._id;
        } else {
            // If logged-in user is normal user
            // createdBy contains admin id
            adminId = req.user.createdBy;
        }

        // Get all users under this admin
        const users = await User.find({
            $or: [
                { _id: adminId }, // admin himself
                { createdBy: adminId }, // admin's users
            ],
        }).select("_id");

        // Extract all ids
        const userIds = users.map((user) => user._id);

        // Get all discussions
        const discussions = await Discussion.find({
            createdBy: { $in: userIds },
        })
            .populate("createdBy", "name email role")
            .populate("replies.user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count
        const totalDiscussions = await Discussion.countDocuments({
            createdBy: { $in: userIds },
        });

        res.status(200).json({
            success: true,
            discussions,
            totalPages: Math.ceil(totalDiscussions / limit),
            currentPage: page,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const discussion = await Discussion.findByIdAndUpdate(id, { $set: data }, { new: true });

        res.status(200).json({
            success: true,
            message: "Discusstion topic updated",
            discussion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(data,'data')
        const discussion = await Discussion.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Discusstion topic deleted",
            discussion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;
        // const discussion = await Discussion.findById(id); 
        const discussion = await Discussion.findById(id).populate("createdBy", "name").populate("replies.user", "name");
        res.status(200).json({
            success: true,
            discussion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDiscussionByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        // const discussion = await Discussion.findById(id);
        const discussion = await Discussion.find({ createdBy: id }).populate("createdBy", "name email").populate("replies.user", "name email").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            discussion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// find discussion topic using userId

export const getUserDiscussions = async (req, res) => {
    try {
        const { id } = req.params;
        const discussion = await Discussion.find({ createdBy: id }).populate("replies.user", "name email").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            discussion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { comment, userId } = req.body;
        // console.log(req.body);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const discussion = await Discussion.findById(req.params.id);

        discussion.replies.push({
            comment: comment,
            user: userId,
        });

        await discussion.save();

        res.status(200).json({
            success: true,
            message: "Comment added successfully"
            // discussion 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const likeDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const discussion = await Discussion.findById(id);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found"
            });
        }
        // console.log(discussion, 'discussion')
        // check if already liked
        const alreadyLiked = discussion.likes.find(
            (like) => like?.user?.toString() === userId
        );

        // console.log(alreadyLiked, 'alreadyliked')

        if (alreadyLiked) {
            // unlike
            discussion.likes = discussion.likes.filter(
                (like) => like?.user?.toString() !== userId
            );

            await discussion.save();

            return res.status(200).json({
                success: true,
                message: "Unliked successfully",
                likes: discussion.likes
            });
        }

        // like
        discussion.likes.push({
            user: userId
        });

        await discussion.save();

        res.status(200).json({
            success: true,
            message: "Liked successfully",
            likes: discussion.likes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};