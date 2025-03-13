const User = require("../models/User");
const Post = require("../models/Post");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();
    const totalLikes = await Post.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } },
    ]);
    const totalVotes = await Question.aggregate([
      { $group: { _id: null, total: { $sum: "$votes" } } },
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalQuestions,
      totalAnswers,
      totalLikes: totalLikes[0]?.total || 0,
      totalVotes: totalVotes[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

// delete the post (Admin Only)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Delete Question (Admin Only)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};

// Get all users with optional search (by username or email)
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ],
      };
    }

    const users = await User.find(query).select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
