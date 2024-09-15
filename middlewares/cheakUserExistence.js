import multer from "multer";
import { User } from "../models/user.model.js";

// Use multer to handle multipart/form-data
const upload = multer();

// Middleware to check if user exists before uploading files
const checkUserExistence = async (req, res, next) => {
  try {
    // `req.body` will now contain the form fields after multer processes the request
    const { username, email } = req.body
    console.log(req.body); // Should now log the expected form data

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(409).json({
        message:
          "User is already registered with this email or username. Please try another email.",
      });
    }

    // If no user is found, continue to the file upload middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error occurred" });
  }
};

export default checkUserExistence;
