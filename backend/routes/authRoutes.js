const express = require('express');
const upload = require('../middlewares/uploadMemory');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadUserProfileImage } = require('../controllers/uploadUserProfileImage');

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router.post('/upload-image', uploadUserProfileImage
);

module.exports = router;