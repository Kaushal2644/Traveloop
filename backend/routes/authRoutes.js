const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile', protect, getProfile);
router.post('/profile', protect, updateProfile);

module.exports = router;