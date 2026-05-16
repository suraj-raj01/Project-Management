import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, required: true },
            // reply: [
            //     {
            //         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            //         comment: { type: String, required: true },
            //         createdAt: { type: Date, default: Date.now },
            //     }
            // ],
            createdAt: { type: Date, default: Date.now },
        }
    ],
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
}, { timestamps: true })

const Discussion = mongoose.model("Discussion", discussionSchema);

export default Discussion;