import multer from "multer";
import { User } from "../models/user.model.js";

// Configure multer to handle file uploads
const upload = multer({
  dest: './Public/temp', // Temporary directory to store files
});

// Middleware to check if user exists before uploading files
const checkUserExistence = [
  // Middleware to handle file uploads
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  
  // Middleware to check user existence
  async (req, res, next) => {
    try {
      const { username, email } = req.body;

      // Check if username and email are provided
      if (!username || !email) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if user already exists
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user) {
        return res.status(409).json({
          message: "User is already registered with this email or username. Please try another.",
        });
      }

      // Proceed to the next middleware if no user is found
      next();
      
    } catch (error) {
      return res.status(500).json({ message: "Server error occurred." });
    }
  },
];

export default checkUserExistence;
