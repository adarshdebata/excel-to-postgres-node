const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const convertExcelToJson = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);
  const data = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData = {
      RollNo: row.getCell(1).value,
      Name: row.getCell(2).value,
      Mail: row.getCell(3).value,
      Entry_time: row.getCell(4).value,
      Exit_time: row.getCell(5).value,
      Total_time: row.getCell(6).value.toString(),
    };
    data.push(rowData);
  });

  return data;
};

const saveData = async (data, pool) => {
  const client = await pool.connect();
  try {
    for (let record of data) {
      const { RollNo, Name, Mail, Entry_time, Exit_time, Total_time } = record;

      // Convert time strings to PostgreSQL timestamp format
      const entryTime = new Date(Entry_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const exitTime = new Date(Exit_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let totalInterval;
      if (typeof Total_time === "string" && Total_time.match(/^\d{2}:\d{2}$/)) {
        const [hours, minutes] = Total_time.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          totalInterval = `${hours} hours ${minutes} minutes`;
        } else {
          throw new Error(`Invalid Total_time format: ${Total_time}`);
        }
      } else {
        throw new Error(`Invalid Total_time format: ${Total_time}`);
      }

      const result = await client.query(
        "SELECT * FROM students WHERE RollNo = $1",
        [RollNo]
      );

      if (result.rows.length > 0) {
        await client.query(
          "UPDATE students SET Name = $1, Mail = $2, Entry_time = to_timestamp($3, 'YYYY-MM-DD HH24:MI:SS'), Exit_time = to_timestamp($4, 'YYYY-MM-DD HH24:MI:SS'), Total_time = $5::interval WHERE RollNo = $6",
          [Name, Mail, entryTime, exitTime, totalInterval, RollNo]
        );
        logResponse(`Updated: ${JSON.stringify(record)}`);
      } else {
        await client.query(
          "INSERT INTO students (RollNo, Name, Mail, Entry_time, Exit_time, Total_time) VALUES ($1, $2, $3, to_timestamp($4, 'YYYY-MM-DD HH24:MI:SS'), to_timestamp($5, 'YYYY-MM-DD HH24:MI:SS'), $6::interval)",
          [RollNo, Name, Mail, entryTime, exitTime, totalInterval]
        );
        logResponse(`Created: ${JSON.stringify(record)}`);
      }
    }
    return { message: "Data processed successfully" }; // Response for Postman
  } catch (error) {
    console.log("Controller Error: " + error);
    logResponse(`Error: ${error.message}`);
    return { error: error.message }; // Response for Postman in case of error
  } finally {
    client.release();
  }
};

const logResponse = (message) => {
  try {
    fs.appendFileSync(
      path.join(__dirname, "../logs/activity.log"),
      `${new Date().toISOString()} - ${message}\n`
    );
  } catch (error) {
    console.error("Error logging:", error);
  }
};

module.exports = {
  convertExcelToJson,
  saveData,
};
