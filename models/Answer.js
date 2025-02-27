const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // Reference to Question
  user: { type: String, required: true }, // User who answered
  avatar: { type: String, required: true }, // Stores avatar URL
  content: { type: String, required: true },
  votes: { type: Number, default: 0 },
  votedBy: [{ type: String }], // Users who voted
  comments: [
    {
      user: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  shares: { type: Number, default: 0 },
  savedBy: [{ type: String }], // Users who saved the answer
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Answer', answerSchema);
