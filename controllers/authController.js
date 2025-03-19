const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/Profile.js")


exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "Username already exists!" });

    // Check if the email already exists
    let emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ msg: "Email already exists!" });

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    // **Create a default user profile**
    const userProfile = new UserProfile({
      accountUsername: username, // Link profile to the user
      username, // Same as the user's username
      gender: "", // Default empty, can be updated later
      profilePic: "", // Default empty, can be updated later
      education: "",
      address: "",
      dob: null,
      email, // Store email as part of the profile
    });

    await userProfile.save();

    res.status(200).json({ msg: "User registered successfully!", profile: userProfile });
  } catch (err) {
    console.error("Register Error: ", err);
    res.status(500).json({ msg: "Server error, please try again later!" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// handle the guest admin 
exports.guestAdminLogin = async(req,res) => {
  const user = {
    username: "AdminGuest",
    role: "admin",
  };
  // Generate a temporary token with limited privileges
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ token, user });
}