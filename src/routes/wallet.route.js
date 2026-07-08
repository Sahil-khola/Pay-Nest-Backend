import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addMoney, payBills } from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/add-money", protect,addMoney);
router.post("/pay-bills", protect,payBills);

export default router;