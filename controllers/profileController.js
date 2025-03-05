const UserProfile = require("../models/Profile");

// Fetch profile
exports.getProfileData = async (req, res) => {
  try {
    const { accountUsername } = req.params; // Get from URL params

    // Fetch profile data only (since posts & answers are separate)
    const profile = await UserProfile.findOne({ accountUsername });
    
    if (!profile) {
      return res.status(200).json({ profile: null }); // ✅ Return null instead of 404
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
    const { accountUsername, gender, username, profilePic, ...restData } = req.body;

    let profile = await UserProfile.findOne({ accountUsername });

    if (profile) {
      const updatedData = { username, gender, ...restData };

      // Validate profilePic (Ensure it's a Base64 string)
      if (profilePic && typeof profilePic !== "string") {
        return res.status(400).json({ message: "Invalid profile picture format" });
      }

      profile = await UserProfile.findOneAndUpdate(
        { accountUsername },
        { ...updatedData, profilePic: profilePic || profile.profilePic }, // Keep old pic if not provided
        { new: true }
      );

      return res.json({ message: "Profile updated successfully", profile });
    }

    // If profile doesn't exist, create a new one
    const newProfile = new UserProfile({
      accountUsername,
      username,
      gender,
      profilePic: typeof profilePic === "string" ? profilePic : "", // Store Base64 string
      ...restData,
    });

    await newProfile.save();

    res.json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

