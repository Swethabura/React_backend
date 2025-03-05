const express = require("express");
const router = express.Router();
const UserProfile = require("../models/Profile");

router.post("/upload-base64", async (req, res) => {
  try {
    const { accountUsername, profilePic } = req.body;

    if (!profilePic || typeof profilePic !== "string") {
      return res.status(400).json({ message: "Invalid profile picture format" });
    }

    // Update the profile with the Base64 image
    const profile = await UserProfile.findOneAndUpdate(
      { accountUsername },
      { profilePic },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile picture updated successfully", profilePic: profile.profilePic });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
