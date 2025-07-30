const express = require('express');
const upload = require('../middlewares/uploadMemory');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadUserProfileImage } = require('../controllers/uploadUserProfileImage');

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/upload-image', uploadUserProfileImage
);

module.exports = router;