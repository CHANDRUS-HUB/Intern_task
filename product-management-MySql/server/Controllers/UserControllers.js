const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserDB = require("../Models/Userdb"); 


const generateToken = (id, name, email, res) => {
    const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000 
    });

    return token;
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

        
        if (!generateToken) {
            console.error("generateToken function is undefined.");
            return res.status(500).json({ message: "Token generation error." });
        }

        
        const token = generateToken(user.id, user.name, user.email, res);

        // Cookie Setup
        res.cookie("name", user.name, {
            httpOnly: true,
            secure:  process.env.NODE_ENV === "production"? true : false,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Logged in successfully",
            token,
            user:{id: user._id, name: user.name, email:user.email}
        });

    } catch (error) {
        console.error("Login Error:", error);  
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};


// Logout User
const logoutUser = (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    res.status(200).json({ message: "Logged out successfully" });
};


//auth-check
const authCheck = (req, res) => {
    const token = req.cookies?.jwt; 

    if (!token) {
        return res.status(401).json({
            isAuthenticated: false,
            message: "No token provided. Access denied."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                isAuthenticated: false,
                message: "Invalid or expired token. Please log in again."
            });
        }

        res.status(200).json({
            isAuthenticated: true,
            user: decoded, 
            message: "Authentication successful."
        });
    });
};



module.exports = { registerUser, loginUser, logoutUser,authCheck };
