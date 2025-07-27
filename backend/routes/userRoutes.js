const express = require("express");
const { registerUser } = require("../controller/userControllers");

const router = express.Router();

// Register user
router.route('/').post(registerUser);

// Future login route
// router.post('/login', authUser);

module.exports = router;
