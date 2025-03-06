const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const authenticateToken = require("../Middleware/LoginMiddleware");
const { signup,signin } = ("../Controllers/loginControllers");


router.post("/signup",signup);
router.post("/signin",signin);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;
