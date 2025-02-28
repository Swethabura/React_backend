const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Ensure correct path
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage });

router.post("/upload-url", upload.single("profilePic"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `/public/uploads/${req.file.filename}`; // Correct path

  res.json({
    message: "File uploaded successfully",
    filePath: fileUrl, // Return frontend-friendly URL
  });
});

module.exports = router;
