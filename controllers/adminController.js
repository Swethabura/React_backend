const User = require("../models/User");
const Post = require("../models/Post");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

export const getAdminStats = async() => {
    try{
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalQuestions = await Question.countDocuments();
        const totalAnswers = await Answer.countDocuments();
        const totalLikes = await Post.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]);
        const totalVotes = await Question.aggregate([{ $group: { _id: null, total: { $sum: "$votes" } } }]);
        
        res.json({
            totalUsers,
            totalPosts,
            totalQuestions,
            totalAnswers,
            totalLikes: totalLikes[0]?.total || 0,
            totalVotes: totalVotes[0]?.total || 0
          });

    }catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
      }
}
