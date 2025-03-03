const express = require("express");
const {
  createPost,
  getAllPosts,
  likePost,
  addPostComment,
  deletePost,
} = require("../controllers/postController.js");
const { getAllQuestions, createQuestion, deleteQuestion } = require("../controllers/questionController.js");
const {
  addAnswer,
  getAnswersByQuestionId,
  addAnswerComment,
  voteAnswer,
} = require("../controllers/answerController.js");
const { getProfileData, addProfileData } = require("../controllers/profileController.js"); 
const uploadRouter = require("./uploads.js");
const {getUserCollection, savePost, unsavePost, saveAnswer, unsaveAnswer, getAnswersIds, deleteMyPost, deleteMyQuestion} = require("../controllers/savedCollectionController.js");


const router = express.Router();
const app = express();

// Publicly accessible routes
router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.get("/questions", getAllQuestions);
router.post("/questions", createQuestion);
router.get("/:questionId", getAnswersByQuestionId);
router.post("/answers", addAnswer);
router.put("/like/:postId", likePost);
router.put("/vote/:answerId", voteAnswer);
router.post("/post/:postId/comments", addPostComment);
router.post("/answers/:answerId/comments", addAnswerComment);
router.get("/profile/:accountUsername", getProfileData);
router.put("/profile", addProfileData);
router.get("/user-collection/:accountUsername", getUserCollection);
router.post("/user-collection/save-post", savePost);
router.post("/user-collection/unsave-post", unsavePost);
router.post("/user-collection/save-answer", saveAnswer);
router.post("/user-collection/unsave-answer", unsaveAnswer);
router.post("/answers/by-ids", getAnswersIds);
router.delete("/post/:postId", deletePost);
router.delete("/posts/delete", deleteMyPost);
router.delete("/question/:postId", deleteQuestion);
router.delete("/question/deleteQuestion", deleteMyQuestion);


// Mount the uploadRouter under /profile-pic
router.use("/profile-pic", uploadRouter);


module.exports = router;