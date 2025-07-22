const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const upload = require('../middlewares/uploadMemory');

const bucket = () =>
  new GridFSBucket(mongoose.connection.db, { bucketName: 'profileImages' });

const uploadUserProfileImage = [
  upload.single('profileImage'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const stream = bucket().openUploadStream(
        `anon_${Date.now()}_${req.file.originalname}`,
        { metadata: { temp: true } }
      );
      
      stream.end(req.file.buffer, () => {
        return res.json({ imageId: stream.id.toString() });
      });

      stream.on('error', (err) => {
        return res.status(500).json({ message: 'Upload failed', error: err.message });
      });
    } catch (error) {
      res.status(500).json({ message: 'Upload error', error: error.message });
    }
  }
];

module.exports = { uploadUserProfileImage };