const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Stores the username
  avatar: { type: String, required: true }, // Stores the avatar URL
  content: { type: String, required: true }, // Post content
  image: { type: String }, // Optional image
  likes: { type: Number, default: 0 }, // Number of likes
  comments: [
    {
      user: { type: String, required: true }, // Commenter's username
      text: { type: String, required: true }, // Comment text
    },
  ],
  likedBy: [{ type: String, default: []}], // Array of usernames who liked the post
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('Post', postSchema);


