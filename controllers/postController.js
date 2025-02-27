const Post = require("../models/Post");

// to create a new post
exports.createPost = async (req, res) => {
  try {
    const { user, avatar, content, image } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: "Post content cannot be empty." });
    }

    const newPost = new Post({
      user,
      avatar,
      content,
      image,
      likes: 0,
      likedBy: [],
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to fetch all the posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to add or remove like
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // Get logged-in username

    const post = await Post.findById(postId);
    if (!postId) return res.status(404).json({ message: "Post not found!" });

    // check if user has already liked the post
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((u) => u !== userId);
    } else {
      post.likes += 1;
      post.likedBy.unshift(userId);
    }

    await post.save();
    res.json({ success: true, likes: post.likes, likedBy: post.likedBy });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// for adding a comment in post
exports.addPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user, text };
    post.comments.unshift(newComment); // Add at the top
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
