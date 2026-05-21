import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        planName: {
            type: String,
            required: true,
            enum: ["Free", "Basic", "Pro"],
        },

        price: {
            type: Number,
            required: true,
        },

        duration: {
            type: String,
            default: "Monthly",
        },

        features: [
            {
                type: String,
            },
        ],

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },
        razorpay_order_id: {
            type: String,
            required: false
        },
        razorpay_payment_id: {
            type: String,
            required: false
        },
        razorpay_signature: {
            type: String,
            required: false
        },
        startDate: {
            type: Date,
            default: Date.now,
        },

        endDate: {
            type: Date,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;