const mongoose = require('mongoose');

const MultilangString = {
  en: { type: String, default: '' },
  ru: { type: String, default: '' },
  kz: { type: String, default: '' },
};

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: MultilangString,

    thumbnailLink: {
      type: String,
    },
    
    template: {
      theme: { type: String },
      colorPalette: [String],
    },

    profileInfo: {
      profilePreviewUrl: String,
      fullName: MultilangString,
      designation: MultilangString,
      summary: MultilangString,
    },

    contactInfo: {
      email: String,
      phone: String,
      location: MultilangString,
      linkedin: String,
      github: String,
      website: String,
    },

    workExperience: [
      {
        company: MultilangString,
        role: MultilangString,
        startDate: String,
        endDate: String,
        description: MultilangString,
      },
    ],

    education: [
      {
        degree: MultilangString,
        institution: MultilangString,
        startDate: String,
        endDate: String,
      },
    ],

    skills: [
      {
        name: MultilangString,
        progress: Number,
      },
    ],

    projects: [
      {
        title: MultilangString,
        description: MultilangString,
        github: String,
        liveDemo: String,
      },
    ],

    certifications: [
      {
        title: MultilangString,
        issuer: MultilangString,
        year: String,
      },
    ],

    languages: [
      {
        name: MultilangString,
        progress: Number,
      },
    ],

    interests: [
      {
        name: MultilangString,
      }
    ], 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);