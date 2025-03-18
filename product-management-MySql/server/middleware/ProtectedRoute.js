const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies?.jwt; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: "No token provided. Access denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token. Access denied." });
    }
};

module.exports = protect;
