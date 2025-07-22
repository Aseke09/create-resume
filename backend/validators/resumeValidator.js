const Joi = require('joi');

const multilangString = Joi.object({
    en: Joi.string().allow('').required(),
    ru: Joi.string().allow('').required(),
    kz: Joi.string().allow('').required(),
});

const resumeSchema = Joi.object({
  title: multilangString.required(),
  colorPalette: Joi.array().items(Joi.string()).optional(),

  profileInfo: Joi.object({
    profilePreviewUrl: Joi.string().uri().allow(''),
    fullName: multilangString.required(),
    designation: multilangString.required(),
    summary: multilangString.required(),
  }),

  contactInfo: Joi.object({
    email: Joi.string().email().allow(''),
    phone: Joi.string().allow(''),
    location: multilangString.required(),
    linkedin: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow(''),
    website: Joi.string().uri().allow(''),
  }),

  workExperience: Joi.array().items(
    Joi.object({
      company: multilangString,
      role: multilangString,
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow(''),
      description: multilangString,
    })
  ),

  education: Joi.array().items(
    Joi.object({
      degree: multilangString,
      institution: multilangString,
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow(''),
    })
  ),

  skills: Joi.array().items(
    Joi.object({
      name: multilangString,
      progress: Joi.number().min(0).max(100),
    })
  ),

  projects: Joi.array().items(
    Joi.object({
      title: multilangString,
      description: multilangString,
      github: Joi.string().uri().allow(''),
      liveDemo: Joi.string().uri().allow(''),
    })
  ),

  certifications: Joi.array().items(
    Joi.object({
      title: multilangString,
      issuer: multilangString,
      year: Joi.string().allow(''),
    })
  ),

  languages: Joi.array().items(
    Joi.object({
      name: multilangString,
      progress: Joi.number().min(0).max(100),
    })
  ),

  interests: Joi.array().items(multilangString).default([])
});

module.exports = resumeSchema;