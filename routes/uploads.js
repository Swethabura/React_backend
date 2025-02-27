const express = require("express");
const multer = require("multer");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage });

// Endpoint to handle file uploads
router.post("/upload-url", upload.single("profilePic"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Normalize path for frontend usage
  const fileUrl = `${apiUrl}/public/uploads/${response.data.filePath}`;

  res.json({
    message: "File uploaded successfully",
    filePath: fileUrl, // Return frontend-friendly URL
  });
});

module.exports = router;
