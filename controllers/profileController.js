const express = require("express");
const UserProfile = require("../models/Profile");

// Fetch profile
exports.getProfileData = async (req, res) => {
  try {
    const { accountUsername } = req.params; // Get from URL params

    const profile = await UserProfile.findOne({ accountUsername });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile fetched successfully", profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update profile
exports.addProfileData = async (req, res) => {
  try {
    const { accountUsername, gender, username, ...restData } = req.body; // Extract username separately

    let profile = await UserProfile.findOne({ accountUsername }); // Find by accountUsername

    if (profile) {
      // If profile exists, update it
      profile = await UserProfile.findOneAndUpdate(
        { accountUsername }, // Ensure this searches correctly
        { username, ...restData, gender }, // Allow username updates
        { new: true }
      );
      return res.json({ message: "Profile updated successfully", profile });
    }

    // If profile doesn't exist, create a new one
    const newProfile = new UserProfile({
      accountUsername, // Store permanent identifier
      username, // Allow changeable username
      gender,
      ...restData,
    });

    await newProfile.save();
    res.json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
