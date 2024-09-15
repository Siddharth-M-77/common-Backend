import express from "express";
import connectDB from "./DB/db.js";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({}); // Load environment variables

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "Public" directory
app.use(express.static("Public"));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware to parse cookies
app.use(cookieParser());

// Route handling
app.use("/api/v1/user", userRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000; 

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
