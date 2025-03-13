const express = require('express');
const {protect, adminOnly} = require ("../middleware/authMiddleware.js");
const {getAllPosts} = require("../controllers/postController.js");
const {getAllQuestions} = require("../controllers/questionController.js");
const { getAdminStats, deletePost, deleteQuestion, getAllUsers, deleteUser } = require('../controllers/adminController.js');

const router = express.Router();

// Admin Dashboard Welcome Route
router.get("/dashboard", protect, adminOnly, (req,res)=>{
    res.json({msg: "Welcome to the admin dashboard!"});
});

// Fetch all posts (Admin only)
router.get("/adminPosts", protect,adminOnly,getAllPosts);

// Fetch all questions (Admin only)
router.get("/adminQuestions", protect, adminOnly, getAllQuestions);

router.get("/stats",protect,adminOnly,getAdminStats);
router.delete("/questions/:id", protect,adminOnly,deleteQuestion);
router.delete("/posts/:id", protect,adminOnly,deletePost);
router.get("/users",protect,adminOnly,getAllUsers);
router.delete("/user/:id",protect,adminOnly,deleteUser);

module.exports = router;