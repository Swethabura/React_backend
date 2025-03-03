const Question = require("../models/Question");
const UserCollection = require("../models/UserCollection");

exports.createQuestion = async (req, res) => {
  try {
    const { user, avatar, content, image, title } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: "Question content cannot be empty." });
    }

    // Create new question
    const newQuestion = new Question({
      user,
      avatar,
      title,
      content,
      image,
      answers: [],
      votes: 0,
      votedBy: [],
    });

    await newQuestion.save(); // Save question in the Question model

    // Find or create UserCollection for this user
    let userCollection = await UserCollection.findOne({ accountUsername: user });

    if (!userCollection) {
      userCollection = new UserCollection({
        accountUsername: user,
        savedPosts: [],
        savedAnswers: [],
        myPosts: [],
        myAnswers: [],
        myQuestions: [],
      });
    }

    // Add the new question to "myQuestions"
    userCollection.myQuestions.unshift(newQuestion._id);
    await userCollection.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to get all the question
exports.getAllQuestions = async (req,res) => {
    try{
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};