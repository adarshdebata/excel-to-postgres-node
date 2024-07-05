const express = require('express');
const { convertExcelToJson, saveData } = require('../controllers/dataController');
const validateData = require('../middlewares/validateData');
const checkDataFormat = require('../middlewares/checkDataFormat');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/', validateData, async (req, res, next) => {
    try {
      const data = await convertExcelToJson(req.file.path);
      req.body.data = data;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to convert Excel to JSON' });
    }
  }, checkDataFormat, async (req, res) => {
    try {
      const response = await saveData(req.body.data, pool);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data to the database' });
    }
  });

  return router;
};
