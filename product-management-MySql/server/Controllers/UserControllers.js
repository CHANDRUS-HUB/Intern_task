const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserDB = require("../Models/Userdb");  // Correct import of your model

// Generate JWT Token
const generateToken = (userId, name, email, res) => {
    const token = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(" Received Data:", req.body);

    try {
        const existingUser = await UserDB.findOne({ where: { email } });
        if (existingUser) {
            console.log(" User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserDB.create({ name, email, password: hashedPassword });

        console.log("User registered successfully!");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(" Error in signup:", error);
        res.status(500).json({ error: "Error in signup", details: error.message });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserDB.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid Email credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password credentials" });

        generateToken(user.id, user.name, user.email, res);

        res.cookie("name", user.name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update User
const updateUserController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [updated] = await UserDB.update(
            { name, password: hashedPassword },
            { where: { email } }
        );

        if (!updated) return res.status(400).json({ message: "User does not exist" });

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error('Error in updating user:', error);
        res.status(500).json({ error: 'Error in updating user' });
    }
};

// Logout User
const logoutUser = (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser, updateUserController };
