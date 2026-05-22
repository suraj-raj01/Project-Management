import Plan from "../models/plansModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/userModel.js";

export const savePlans = async (req, res) => {
    try {
        const { newplan, userInfo } = req.body;
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        // REMOVE $ SYMBOL
        const amount =
            Number(
                newplan.price.replace("$", "")
            ) * 100 * 93;

        const options = {
            amount,
            currency: "INR",
            receipt: crypto
                .randomBytes(10)
                .toString("hex"),
        };

        const razorpayOrder =
            await instance.orders.create(
                options
            );

        const plan = await Plan.create({
            planName: newplan.name,

            price: amount / 100,

            features: newplan.features,

            razorpay_order_id:
                razorpayOrder.id,

            paymentStatus: "pending",

            userId: userInfo._id,
        });

        res.status(201).json({
            success: true,
            order: razorpayOrder,
            planId: plan._id,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPayment = async (
    req,
    res
) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing payment details",
            });
        }

        const sign =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSign = crypto
            .createHmac(
                "sha256",
                process.env.KEY_SECRET
            )
            .update(sign.toString())
            .digest("hex");

        const isValid =
            expectedSign ===
            razorpay_signature;

        if (!isValid) {

            await Plan.findOneAndUpdate(
                {
                    razorpay_order_id,
                },
                {
                    paymentStatus: "failed",
                }
            );

            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment signature",
            });
        }

        const plan =
            await Plan.findOneAndUpdate(
                {
                    razorpay_order_id,
                },
                {
                    razorpay_payment_id,
                    razorpay_signature,
                    paymentStatus: "success",
                },
                { new: true }
            );

        // subscription end date
        const endDate = new Date();

        endDate.setMonth(
            endDate.getMonth() + 1
        );

        await User.findByIdAndUpdate(
            userId,
            {
                subscription:
                    plan.planName,

                subscriptionEndDate:
                    endDate,
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Payment completed successfully ✅",
            plan,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error",
        });
    }
};

// get plans

export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().populate("userId", "name email").sort({ createdAt: -1 })
        if (!plans) {
            return res.status(404).json({ message: "Plans not found", success: false })
        }
        res.status(200).json({ plans, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}