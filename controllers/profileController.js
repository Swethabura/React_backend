const UserProfile = require("../models/Profile");
const Post = require("../models/Post");
const Answer = require("../models/Answer");


// Fetch profile
exports.getProfileData = async (req, res) => {
  try {
    const { accountUsername } = req.params; // Get from URL params

    const profile = await UserProfile.findOne({ accountUsername })
      .populate("savedPosts") // Fetch full post details instead of just IDs
      .populate("myPosts");   // Fetch user's own posts

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
    const { accountUsername, gender, username, profilePic, ...restData } = req.body;

    let profile = await UserProfile.findOne({ accountUsername });

    if (profile) {
      const updatedData = { username, gender, ...restData };

      // Ensure profilePic is a string URL, not binary data
if (profilePic && typeof profilePic !== "string") {
  return res.status(400).json({ message: "Invalid profile picture format" });
}

      profile = await UserProfile.findOneAndUpdate(
        { accountUsername },
        updatedData,
        { new: true }
      );

      return res.json({ message: "Profile updated successfully", profile });
    }

    // If profile doesn't exist, create a new one
    const newProfile = new UserProfile({
      accountUsername,
      username,
      gender,
      profilePic: typeof profilePic === "string" ? profilePic : "", // Store only URL
      ...restData,
    });

    await newProfile.save();

    res.json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
