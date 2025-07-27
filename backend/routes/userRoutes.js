const express = require("express");
const { registerUser, authUser,allUsers } = require("../controller/userControllers");
const { protect }=require('../middleware/authMiddleware')
const router = express.Router();

// Register user
router.route('/').post(registerUser).get(protect,allUsers);

// login route
router.post('/login', authUser);




module.exports = router;
