const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const authenticateToken = async (req, res, next) => {
  try {
    
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "No token, access denied" });

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
