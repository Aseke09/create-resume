const express = require('express');
const {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMemory');
const { uploadResumeImages } = require('../controllers/uploadImage');
const validateResume = require('../middlewares/validateResume');

const router = express.Router();

router.post('/', protect, validateResume, createResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.post('/:id/upload-images', 
    protect,
    // upload.any('profileImage'),
    upload.fields([{ name: 'thumbnail'}, { name: 'profileImage'}]),
    uploadResumeImages);


router.delete('/:id', protect, deleteResume);

module.exports = router;