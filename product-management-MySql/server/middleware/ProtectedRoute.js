
const User = require("../Models/Userdb");
const jwt = require("jsonwebtoken");


const protect = async (req, res, next) => {
    try {
       
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Not authorized, no token" });

         const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
       
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

module.exports = protect;