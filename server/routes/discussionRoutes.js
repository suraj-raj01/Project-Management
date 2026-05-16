import express from "express";
import { createDiscussion, getAllDiscussions, getDiscussionById, addComment, likeDiscussion, getDiscussionByUserId, updateDiscussion, deleteDiscussion } from "../controllers/dicussionController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protect, createDiscussion);
router.get("/", protect, getAllDiscussions);
router.get("/:id", protect, getDiscussionById);
router.put("/:id", protect, updateDiscussion);
router.delete("/:id", protect, deleteDiscussion);
router.get("/user/:id", protect, getDiscussionByUserId);
router.post("/:id/comments", protect, addComment);
router.post("/:id/like", protect, likeDiscussion);

export default router; 