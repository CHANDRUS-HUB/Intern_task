const express = require("express");



const authenticateToken = require("../Middleware/LoginMiddleware");
const { signup, signin } = require("../Controllers/loginContrllers");


const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;
