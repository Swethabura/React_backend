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
