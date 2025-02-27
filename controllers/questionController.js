const Question = require("../models/Question");

exports.createQuestion = async (req,res) => {
  try {
    const { user, avatar, content, image,title } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: "Question content cannot be empty." });
    }

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

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuestions = async (req,res) => {
    try{
        const questions = await Question.find();
        res.json(questions);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};