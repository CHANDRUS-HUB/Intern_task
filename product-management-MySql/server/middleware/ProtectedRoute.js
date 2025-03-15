const User = require("../Models/Userdb");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    // Get token from session, cookies, or authorization header
    const token = req.session.token || req.cookies?.jwt || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            isAuthenticated: false, 
            message: "No token provided. Access denied." 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user details to request
        req.user = decoded;

        // (Optional) Fetch full user details from the database
        const user = await User.findById(decoded.id).select("-password"); 
        if (!user) {
            return res.status(401).json({ isAuthenticated: false, message: "User not found. Access denied." });
        }

        req.user = user; // Attach full user details to request
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(403).json({ 
            isAuthenticated: false, 
            message: "Invalid or expired token. Please log in again." 
        });
    }
};

module.exports = protect;
