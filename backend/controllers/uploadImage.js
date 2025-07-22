const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const Resume = require('../models/Resume');
const upload = require('../middlewares/uploadMemory');

const deleteIfExists = async (id, bucketName) => {
  if (!id) return;
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName });
    await bucket.delete(new mongoose.mongo.ObjectId(id));
  } catch {/* ignore */ }
};

const uploadResumeImages = [
  
  async (req, res) => {
   try {
      
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id, });

    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    
    const db = mongoose.connection.db;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const profileImageFile = req.files?.profileImage?.[0];
    const imageIdFromBody = req.body.profileImageId;

    let thumbnailId = null;
    let profileImageId = null;

    // ✅ Upload thumbnail to GridFS
    if (thumbnailFile) {
      const extension = thumbnailFile.mimetype?.split('/')[1] || 'jpg';
      const bucket = new GridFSBucket(db, { bucketName: "resumeImages"});

      const uploadStream = bucket.openUploadStream(`thumb_${Date.now()}.${extension}`,
       { metadata: {
          resumeId: resume._id.toString(),
          field: "thumbnail",
         },
      })

      uploadStream.end(thumbnailFile.buffer);
      
      const thumbResult = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
      });

      thumbnailId = thumbResult.toString();

      await deleteIfExists(resume.thumbnailLink, "resumeImages");
      resume.thumbnailLink = thumbnailId;
    }

    if (profileImageFile) {
      const profileBucket = new GridFSBucket(db, {bucketName: "profileImages"});
      const profileStream = profileBucket.openUploadStream(
          `profile_${Date.now()}_${profileImageFile.originalname || "profile.jpg"}`,
          {
            metadata: {
              resumeId: resume._id.toString(),
              field: "profileImage",
            },
          }
        );

        profileStream.end(profileImageFile.buffer);

        const profileResult = await new Promise((resolve, reject) => {
          profileStream.on("finish", () => resolve(profileStream.id));
          profileStream.on("error", reject);
        });

        profileImageId = profileResult.toString();

        await deleteIfExists(
          resume.profileInfo?.profilePreviewUrl,
          "profileImages"
        );

    } else if (imageIdFromBody) {
      profileImageId = imageIdFromBody;
    }
      resume.profileInfo = resume.profileInfo || {
          fullName: { en: "", ru: "", kz: "" },
          designation: { en: "", ru: "", kz: "" },
          summary: { en: "", ru: "", kz: "" },
        };

      if (profileImageId) {
        resume.profileInfo.profilePreviewUrl = profileImageId;
      }

    await resume.save();

    return res.json({
      message: 'Images uploaded',
      thumbnailId,
      profileImageId,
    });
  } catch (error) {
      console.error('Image upload failed:', error );
      return res.status(500).json({ message: 'Upload failed', error: error.message })
  }
}
]
  
module.exports = { uploadResumeImages };