const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser} = require("../Controllers/UserControllers");
const protect = require("../middleware/ProtectedRoute");



router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", protect,logoutUser);






module.exports = router;