const path = require('path');

const validateData = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileType = path.extname(file.originalname).toLowerCase();
  if (fileType !== '.xlsx' && fileType !== '.xls') {
    return res.status(400).json({ error: 'Invalid file format. Please upload an .xlsx or .xls file' });
  }

  next();
};

module.exports = validateData;
