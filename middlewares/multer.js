import multer from "multer";
import fs from "fs"
import path from "path";

// Ensure the upload directory exists
const tempDir = "./Public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true }); // Create directory if it doesn't exist
}

// File type validation for both images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images and videos are allowed!"), false); // Reject the file
  }
};

// Configure storage with filename and path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Save files in the './Public/temp' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // Sanitize filename
    cb(null, sanitizedFileName + "-" + uniqueSuffix);
  },
});

// Define the file size limits for different file types
const limits = {
  fileSize: function (req, file, cb) {
    // Set different file size limits for images and videos
    if (file.mimetype.startsWith("image")) {
      cb(null, 5 * 1024 * 1024); // 5 MB for images
    } else if (file.mimetype.startsWith("video")) {
      cb(null, 50 * 1024 * 1024); // 50 MB for videos
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
};

// Set up multer with limits and validation
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Max size for videos (50 MB)
  },
});


export default upload;
