const express = require('express');
const {protect, adminOnly} = require ("../middleware/authMiddleware.js");
const {getAllPosts} = require("../controllers/postController.js");
const {getAllQuestions} = require("../controllers/questionController.js")

const router = express.Router();

// Admin Dashboard Welcome Route
router.get("/dashboard", protect, adminOnly, (req,res)=>{
    res.json({msg: "Welcome to the admin dashboard!"});
});

// Fetch all posts (Admin only)
router.get("/posts", protect,adminOnly,getAllPosts);

// Fetch all questions (Admin only)
router.get("/questions", protect, adminOnly, getAllQuestions);

module.exports = router;