import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import authRoute from "./src/routes/user.route.js";
import transactionRoute from "./src/routes/transaction.route.js";
import walletRoute from "./src/routes/wallet.route.js";
import db from "./src/config/db.js";
const app = express();

// Swagger ----------------->
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
try {
   if (swaggerDocument) {
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   }
} catch (error) {
    console.log(error);
}


// Middleware ---------------->
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 

// Routes -----------------> 
app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/wallet", walletRoute);
app.get("/", (req, res) => {
    res.send("Pay Nest is running");
})

app.use(cors());


db();
const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`swagger docs available at http://localhost:${port}/api-docs`);
}); 