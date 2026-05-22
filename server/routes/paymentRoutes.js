import express from "express";
import { getPlans, savePlans, verifyPayment } from "../controllers/paymentController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/plans", savePlans);
router.post("/verify", verifyPayment);
router.get("/plans", protect, getPlans);

export default router;