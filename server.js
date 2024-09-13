import express from "express";
import connectDB from "./DB/db.js";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./.env" });
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());
//Purpose: Parse incoming request bodies (JSON or URL-encoded).
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const PORT = 8000;

app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on the PORT: ${PORT} !!!`);
});
