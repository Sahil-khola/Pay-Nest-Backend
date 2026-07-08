import express from "express";
import {login , signup , getUserProfile,setMpin} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/set-mpin",protect,setMpin)
router.get("/profile",protect, getUserProfile);


export default router;