import express from "express";
import {login , signup ,getAllUser} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/allusers",protect,getAllUser);

export default router;  