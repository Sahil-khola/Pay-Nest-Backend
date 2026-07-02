import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection

db.on("connected", () => console.log("connected"));
db.on("disconnected", () => console.log("disconnected"));
db.on("error", () => console.log("error"))
; 