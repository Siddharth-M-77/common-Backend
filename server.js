import express from "express";
import connectDB from "./DB/db.js";
import dotenv from "dotenv"

dotenv.config({})
const app = express();

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("hello from server");
});



app.listen(PORT, () => {
    connectDB()
  console.log(`server is running on the PORT: ${PORT} !!!`);
});
