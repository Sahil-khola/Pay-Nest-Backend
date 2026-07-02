import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import authRoute from "./src/routes/user.route.js";
import  "./src/config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Pay Nest is running");
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`swagger docs available at http://localhost:${port}/api-docs`);
}); 