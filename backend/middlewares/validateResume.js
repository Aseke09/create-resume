const resumeSchema = require('../validators/resumeValidator');

const validateResume = (req, res, next) => {
  const { error, value } = resumeSchema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true, 
});

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message),
    });
  }

  req.body = value; 
  next();
};

module.exports = validateResume;