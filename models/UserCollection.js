const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountUsername: { type: String, required: true, unique: true },
  savedPosts: [{ type: Object,},],
  savedAnswers: [{type: Object, },],
  myPosts: [{type: Object,}],
  myAnswers: [{type: Object,}],
  myQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], 
});

module.exports = mongoose.model("UserCollection", UserSchema);
