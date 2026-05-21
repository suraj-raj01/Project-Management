import express from "express";
import { savePlans, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/plans", savePlans);
router.post("/verify", verifyPayment);

export default router;