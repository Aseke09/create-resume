const fs = require('node:fs');
const path = require('node:path');
const Resume = require('../models/Resume');
const { json } = require('node:stream/consumers');
const mongoose  = require('mongoose');
const { sanitizeMultilangArray } = require('../utils/sanitizeMultilang');

const createResume = async (req, res) => {
    try {
      
        // const { title } = req.body;

        if (Array.isArray(req.body.interests) && typeof req.body.interests[0] === 'string') {
      req.body.interests = req.body.interests.map((item) => ({
        name: {en: item, ru: item, kz: item},
      }));
    }

        const defaultResumeData = {
          title: { en: '', ru: '', kz: '' },

          template: {                                 
             theme: '',
             colorPalette: [],
          },
            profileInfo: {
                profileImg: null,
                prifilePreviewUrl: '',
                fullName: { en: '', ru: '', kz: '' },
                designation: { en: '', ru: '', kz: '' },
                summary: { en: '', ru: '', kz: '' },
            },
            contactInfo: {
                email: '',
                phone: '',
                location: { en: '', ru: '', kz: '' },
                linkedin: '',
                github: '',
                website: '',

            },
            workExperience: [
                {
                    company: { en: '', ru: '', kz: '' },
                    role: { en: '', ru: '', kz: '' },
                    startDate: '',
                    endDate: '',
                    description: { en: '', ru: '', kz: '' },
                },
            ],
            education: [
                {
                    degree: { en: '', ru: '', kz: '' },
                    institution: { en: '', ru: '', kz: '' },
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: { en: '', ru: '', kz: '' },
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: { en: '', ru: '', kz: '' },
                    description: { en: '', ru: '', kz: '' },
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: { en: '', ru: '', kz: '' },
                    issuer: { en: '', ru: '', kz: '' },
                    year: '',
                },
            ],
            languages: [
                {
                    name: { en: '', ru: '', kz: '' },
                    progress: 0,
                },
            ],

            interests: req.body.interests && req.body.interests.length ? 
             req.body.interests : [
              {
                name: { en: '', ru: '', kz: '' },
              }
            ],
        };

        const newResume = await Resume.create({
            ...defaultResumeData,
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json(newResume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message })
    }
};

const getUserResumes = async (req, res) => {
    try {
      const resumes = await Resume.find({ userId: req.user._id }).sort({
        updatedAt: -1,
      });
      res.json(resumes);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message })
    }
};

const getResumeById = async (req, res) => {
    try {
      const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

      if(!resume) {
        return res.status(404).json({ message: 'Resume not found' })
      }

      res.json(resume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message })
    }
};

const updateResume = async (req, res) => {
    try {
  
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid resume ID' });
      }  

      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });
      
      if(!resume) {
        return res.status(404).json({ message: "Resume not found or unathorized" });
      }

      const allowedFields = [
      'title',
      'template',
      'colorPalette',
      'profileInfo',
      'contactInfo',
      'workExperience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'interests'
    ];
      
      const update = {};
      allowedFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    });
    
      const updated = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
      
      res.json(updated);

    } catch (error) {
      console.error('❌ Error updating resume:', error);
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message })
    }
};

const deleteResume = async (req, res) => {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if(!resume) {
        return res.status(404).json({ message: 'Resume not found or unathorized' });
      }

      const uploadsFolder = path.join(__dirname, '..', 'uploads');
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      if(resume.thumbnailLink) {
        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
        if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
      }

      if(resume.profileInfo?.profilePreviewUrl) {
        const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
        if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldProfile);
      } 

      const deleted = await Resume.findByIdAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Resume not found or unathorized' });
      }

      res.json({ message: 'Resume deleted successfully'})
     } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message })
    }
};

module.exports = {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
};
