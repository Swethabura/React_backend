const express = require("express");
const {
  createPost,
  getAllPosts,
  likePost,
  addPostComment,
} = require("../controllers/postController.js");
const { getAllQuestions, createQuestion } = require("../controllers/questionController.js");
const {
  addAnswer,
  getAnswersByQuestionId,
  addAnswerComment,
  voteAnswer,
} = require("../controllers/answerController.js");
const { getProfileData, addProfileData, savePost, unsavePost, saveAnswer, unsaveAnswer, getMyPosts } = require("../controllers/profileController.js");
const uploadRouter = require("./uploads.js");

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
router.post("/profile/save-post", savePost);
router.post("/profile/unsave-post", unsavePost);
router.post("/profile/save-answer", saveAnswer);
router.post("/profile/unsave-answer", unsaveAnswer);

router.get("/profile/my-posts/:userId", getMyPosts);

// Mount the uploadRouter under /profile-pic
router.use("/profile-pic", uploadRouter);


module.exports = router;