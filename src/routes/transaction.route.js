import express from "express";
import { sendMoney,  getTransactions } from "../controllers/transaction.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMoney);
router.get("/history", protect, getTransactions);



export default router;