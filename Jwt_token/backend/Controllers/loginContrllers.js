const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const router = express.Router();


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[A-Za-z\s]+$/;

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }


    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        msg: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    
    if (!usernameRegex.test(name)) {
      return res.status(400).json({ msg: "Username must contain only letters and spaces" });
    }

    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

      
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

      
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};



module.exports = { signup,signin };
