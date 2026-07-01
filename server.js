import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
// import "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});