const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please provide a valid email" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPass });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "2h" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        points: newUser.points,
        isAdmin: newUser.isAdmin,
        firstLogin: newUser.firstLogin,
        paymentAmount: newUser.paymentAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "2h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        isAdmin: user.isAdmin,
        firstLogin: user.firstLogin,
        paymentAmount: user.paymentAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Mark first login as completed
const markFirstLoginComplete = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstLogin: false },
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        isAdmin: user.isAdmin,
        firstLogin: user.firstLogin,
        paymentAmount: user.paymentAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Export all functions properly
module.exports = {
  registerUser,
  loginUser,
  markFirstLoginComplete,
};
