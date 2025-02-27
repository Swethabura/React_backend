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

// Unsave a post
exports.unsavePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    let user = await UserProfile.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();

    res.status(200).json({ message: "Post unsaved successfully", savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save an answer
exports.saveAnswer = async (req, res) => {
  try {
    const { userId, answerId } = req.body;

    let user = await UserProfile.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (!answer.savedBy.includes(userId)) {
      answer.savedBy.push(userId);
      await answer.save();
    }

    res.status(200).json({ message: "Answer saved successfully", savedBy: answer.savedBy });
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

// Get saved posts
exports.getSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await UserProfile.findById(userId).populate("savedPosts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get saved answers
exports.getSavedAnswers = async (req, res) => {
  try {
    const { userId } = req.params;

    let answers = await Answer.find({ savedBy: userId });
    res.status(200).json({ savedAnswers: answers });
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
