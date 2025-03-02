const Answer = require("../models/Answer");
const Question = require("../models/Question");
const UserCollection = require("../models/UserCollection");

// create a new answer
exports.addAnswer = async (req, res) => {
  try {
    const { questionId, user, content, avatar } = req.body;

    if (!content.trim() || !user || !avatar || !questionId) {
      return res.status(400).json({ message: "All fields are important" });
    }

    // Check if the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Create new answer
    const newAnswer = new Answer({
      questionId,
      user,
      avatar,
      content,
      votes: 0,
      votedBy: [],
      comments: [],
      shares: 0,
      savedBy: [],
    });

    await newAnswer.save(); // Save the answer

    // Push answer reference into the corresponding question
    question.answers.unshift(newAnswer._id);
    await question.save();

    // Find or create UserCollection for this user
    let userCollection = await UserCollection.findOne({ accountUsername: user });

    if (!userCollection) {
      userCollection = new UserCollection({
        accountUsername: user,
        savedPosts: [],
        savedAnswers: [],
        myPosts: [],
        myAnswers: [],
      });
    }

    // Add the new answer to "myAnswers" (push only the _id)
    userCollection.myAnswers.push(newAnswer._id);
    await userCollection.save();

    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    // console.log("Received questionId:", req.params.questionId);
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
};

// Adding comments for answers
exports.addAnswerComment = async (req, res) => {
  const { answerId } = req.params;
  const { userId, text } = req.body; // Match the schema field names

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Create a new comment object following the schema structure
    const newComment = {
      user: userId, // Match the schema field
      text,
      createdAt: new Date(),
    };

    // Push the new comment to the comments array
    answer.comments.push(newComment);
    await answer.save();

    res.json({ answerId, comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// to add or remove like
exports.voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { userId } = req.body; // Get logged-in username

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    // Check if user has already liked the post
    const isVoted = answer.votedBy.includes(userId);

    if (isVoted) {
      answer.votes -= 1;
      answer.votedBy = answer.votedBy.filter((u) => u !== userId);
    } else {
      answer.votes += 1;
      answer.votedBy.unshift(userId);
    }

    await answer.save();
    res.json(answer); // Return the entire updated answer object
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};