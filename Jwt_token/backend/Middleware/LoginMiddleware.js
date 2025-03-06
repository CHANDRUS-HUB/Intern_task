const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const authenticateToken = async (req, res, next) => {
  try {
    
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided, access denied" });
    }

    const token = authHeader.split(" ")[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found, access denied" });
    }

    req.user = user; 
    next(); 
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired, please log in again" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token, access denied" });
    }
    return res.status(500).json({ msg: "Server error during authentication" });
  }
};

module.exports = authenticateToken;
