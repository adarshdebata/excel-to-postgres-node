const express = require("express");
const {
  convertExcelToJson,
  saveData,
} = require("../controllers/dataController");
const { getStudents } = require("../controllers/studentController");
const { deleteStudent } = require("../controllers/deleteController"); // Import the delete controller
const validateData = require("../middlewares/validateData");
const checkDataFormat = require("../middlewares/checkDataFormat");

module.exports = (pool) => {
  const router = express.Router();

  router.post(
    "/",
    validateData,
    async (req, res, next) => {
      try {
        const data = await convertExcelToJson(req.file.path);
        req.body.data = data;
        next();
      } catch (error) {
        res.status(500).json({ error: "Failed to convert Excel to JSON" });
      }
    },
    checkDataFormat,
    async (req, res) => {
      try {
        await saveData(req.body.data, pool);
        res.status(200).json({ message: "Data processed successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to save data to the database" });
      }
    }
  );

  // Route for retrieving students with pagination
  router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const students = await getStudents(pool, page, limit);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve students" });
    }
  });

  // New route for deleting a student by RollNo
  router.delete("/:rollNo", async (req, res) => {
    try {
      const { rollNo } = req.params;
      const result = await deleteStudent(pool, rollNo);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  return router;
};
