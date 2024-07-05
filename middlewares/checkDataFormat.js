const { body, validationResult } = require('express-validator');

const checkDataFormat = [
  body('data.*.RollNo')
    .isInt({ min: 1 }).withMessage('RollNo must be a positive integer'),
  body('data.*.Mail')
    .isEmail().withMessage('Invalid email format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = checkDataFormat;
