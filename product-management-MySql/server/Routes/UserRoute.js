const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, authCheck} = require("../Controllers/UserControllers");




router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/auth-check",authCheck);




module.exports = router;