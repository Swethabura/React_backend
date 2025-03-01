const UserCollection = require("../models/UserCollection");
const UserProfile = require("../models/Profile");
const Post = require("../models/Post");
const Answer = require("../models/Answer");

// Fetch user collection (saved posts, saved answers, my posts, my answers)
exports.getUserCollection = async (req, res) => {
  try {
    const { accountUsername } = req.params;

    // Check if the user exists in UserProfile
    const userProfile = await UserProfile.findOne({ accountUsername });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Fetch the user data from User Collection
    let user = await UserCollection.findOne({ accountUsername });

    // If user collection doesn't exist, return empty arrays
    if (!user) {
      return res.json({
        savedPosts: [],
        savedAnswers: [],
        myPosts: [],
        myAnswers: [],
      });
    }

    res.status(200).json({
      savedPosts: user.savedPosts,
      savedAnswers: user.savedAnswers,
      myPosts: user.myPosts,
      myAnswers: user.myAnswers,
    });
  } catch (error) {
    console.error("Error fetching user collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to save a post
exports.savePost = async (req, res) => {
  try {
    const { accountUsername, postId } = req.body;

    // Check if the user exists in UserProfile DB
    const userProfile = await UserProfile.findOne({ accountUsername });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user exists in User Collection (where we store saved posts)
    let user = await UserCollection.findOne({ accountUsername });

    // If user doesn't exist in User Collection, create a new document
    if (!user) {
      user = new UserCollection({
        accountUsername,
        savedPosts: [],
        savedAnswers: [],
        myPosts: [],
        myAnswers: [],
      });
    }

    // Check if the post is already saved
    const alreadySaved = user.savedPosts.some(
      (savedPost) => savedPost._id.toString() === postId
    );
    if (alreadySaved) {
      return res.status(400).json({ message: "Post already saved" });
    }

    // Save the post object in the savedPosts array
    user.savedPosts.unshift(post);
    await user.save();

    res.status(200).json({
      message: "Post saved successfully",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// unsave the post
exports.unsavePost = async (req, res) => {
  try {
    const { accountUsername, postId } = req.body;

    // Confirm the user exists in UserProfile DB
    const userProfile = await UserProfile.findOne({ accountUsername });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Find the user in the User Collection
    const user = await UserCollection.findOne({ accountUsername });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in saved posts database" });
    }

    // Remove the post object from savedPosts
    user.savedPosts = user.savedPosts.filter(
      (post) => post._id.toString() !== postId
    );
    await user.save();

    res.status(200).json({
      message: "Post unsaved successfully",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in unsavePost:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// save the answer
exports.saveAnswer = async (req, res) => {
  try {
    const { accountUsername, answerId } = req.body;

    // Check if the user exists in UserProfile DB
    const userProfile = await UserProfile.findOne({ accountUsername });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if the answer exists
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Check if user exists in User Collection (where we store saved answers)
    let user = await UserCollection.findOne({ accountUsername });

    // If user doesn't exist in User Collection, create a new document
    if (!user) {
      user = new UserCollection({
        accountUsername,
        savedPosts: [],
        savedAnswers: [],
        myPosts: [],
        myAnswers: [],
      });
    }

    // Check if the answer is already saved
    const alreadySaved = user.savedAnswers.some(
      (savedAnswer) => savedAnswer._id.toString() === answerId
    );

    if (alreadySaved) {
      return res.status(400).json({ message: "Answer already saved" });
    }

    // Save the answer
    user.savedAnswers.unshift(answer);
    await user.save();

    res
      .status(200)
      .json({
        message: "Answer saved successfully",
        savedAnswers: user.savedAnswers,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving answer", error: error.message });
  }
};

// unsave the answer
exports.unsaveAnswer = async (req, res) => {
  try {
    const { accountUsername, answerId } = req.body;

    // Check if the user exists in User Collection
    const user = await UserCollection.findOne({ accountUsername });

    if (!user) {
      return res.status(404).json({ message: "User collection not found" });
    }

    // Filter out the answer to remove it
    user.savedAnswers = user.savedAnswers.filter(
      (savedAnswer) => savedAnswer._id.toString() !== answerId
    );

    await user.save();
    res
      .status(200)
      .json({
        message: "Answer unsaved successfully",
        savedAnswers: user.savedAnswers,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unsaving answer", error: error.message });
  }
};
