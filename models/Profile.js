const mongoose = require("mongoose");

const UserProfile = new mongoose.Schema({
  accountUsername: { type: String, required: true, unique: true }, // The original username from login
  username: { type: String, required: true },
  email: { type: String, required: true },
  education: { type: String },
  address: { type: String },
  dob: { type: Date },
  profilePic: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true } // Added gender field
});

module.exports = mongoose.model("Profile", UserProfile);
