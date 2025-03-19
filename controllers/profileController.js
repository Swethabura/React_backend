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

// Update or Create Profile
exports.addProfileData = async (req, res) => {
  try {
    const { accountUsername, gender, username, profilePic, ...restData } = req.body;

    let profile = await UserProfile.findOne({ accountUsername });

    if (profile) {
      // Update the existing profile
      const updatedData = { username, gender, ...restData };

      if (profilePic && typeof profilePic !== "string") {
        return res.status(400).json({ message: "Invalid profile picture format" });
      }

      profile = await UserProfile.findOneAndUpdate(
        { accountUsername },
        { ...updatedData, profilePic: profilePic || profile.profilePic },
        { new: true }
      );

      return res.json({ message: "Profile updated successfully", profile });
    }

    // Create a new profile (Edge Case Handling)
    const newProfile = new UserProfile({
      accountUsername,
      username,
      gender: gender || "",
      profilePic: typeof profilePic === "string" ? profilePic : "",
      ...restData,
    });

    await newProfile.save();

    res.json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


