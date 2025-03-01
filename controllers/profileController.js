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

exports.savePost = async (req, res) => {
  try {
    const { accountUsername, postId } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find user profile using accountUsername
    const userProfile = await UserProfile.findOne({ accountUsername });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if post is already saved
    if (userProfile.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    // Save the post in the user's profile
    userProfile.savedPosts.push(postId);
    await userProfile.save();

    res.status(200).json({ message: "Post saved successfully", savedPosts: userProfile.savedPosts });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// unsave the post
exports.unsavePost = async (req, res) => {
  try {
    console.log("Full request body received in backend:", req.body); //  Log entire request body

    const { accountUsername, postId } = req.body;
    
    console.log("Extracted accountUsername:", accountUsername); 
    console.log("Extracted postId:", postId);

    if (!accountUsername || !postId) {
      return res.status(400).json({ message: "Missing accountUsername or postId" });
    }

    const userProfile = await UserProfile.findOne({ accountUsername });

    if (!userProfile) {
      console.log("User not found in DB for username:", accountUsername);
      return res.status(404).json({ message: "User profile not found" });
    }

    userProfile.savedPosts = userProfile.savedPosts.filter(id => id.toString() !== postId);
    await userProfile.save();

    const updatedProfile = await UserProfile.findOne({ accountUsername }).populate("savedPosts");

    
    res.status(200).json({
      message: "Post unsaved successfully",
      savedPosts: updatedProfile.savedPosts
    });

  } catch (error) {
    console.error("Error in unsavePost:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save an answer
exports.saveAnswer = async (req, res) => {
  try {
    const { accountUsername, answerId } = req.body;

    let user = await UserProfile.findOne({ accountUsername });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the answer is already saved
    const isAlreadySaved = user.savedPosts.includes(answerId);
    if (isAlreadySaved) {
      return res.status(200).json({ message: "Answer already saved" });
    }

    // Save the answer
    user.savedPosts.push(answerId);
    await user.save();

    res.status(200).json({ message: "Answer saved successfully", savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Unsave an answer
exports.unsaveAnswer = async (req, res) => {
  try {
    const { userId, answerId } = req.body;

    let user = await UserProfile.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.savedBy = answer.savedBy.filter(id => id.toString() !== userId);
    await answer.save();

    res.status(200).json({ message: "Answer unsaved successfully", savedBy: answer.savedBy });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's own posts
exports.getMyPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await UserProfile.findById(userId).populate("myPosts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ myPosts: user.myPosts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
