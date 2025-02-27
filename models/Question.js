const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User who posted the question
  avatar: { type: String, required: true }, // Stores avatar URL
  title: { type: String, required: true }, // Add title field
  content: { type: String, required: true },
  image: { type: String }, // Optional image
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }], // References Answer model
  votes: { type: Number, default: 0 },
  votedBy: [{ type: String }], // Array of users who voted for the question
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);

