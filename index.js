const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const pool = require('./models/db');
const dataRoutes = require('./routes/dataRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to log responses to activity.log
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    fs.appendFileSync(path.join(__dirname, 'logs', 'activity.log'), `${new Date().toISOString()} - ${data}\n`);
    oldSend.apply(res, arguments);
  };
  next();
});

// Use the dataRoutes, with multer to handle file uploads
app.use('/data', upload.single('file'), dataRoutes(pool));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
});
