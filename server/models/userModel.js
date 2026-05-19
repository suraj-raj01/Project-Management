import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member",
        },
        subscription: {
            type: String,
            enum: ["Free", "Basic", "Pro"],
            default: "Free",
        },
        subscriptionEndDate: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;