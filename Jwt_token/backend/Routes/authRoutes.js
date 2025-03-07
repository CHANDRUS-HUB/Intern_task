const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const authenticateToken = require("../Middleware/LoginMiddleware");
const { signup,signin } = ("../Controllers/loginControllers");
const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;
