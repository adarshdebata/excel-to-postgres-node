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

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    fs.appendFileSync(path.join(__dirname, 'logs', 'activity.log'), `${new Date().toISOString()} - ${data}\n`);
    oldSend.apply(res, arguments);
  };
  next();
});

app.use('/data', upload.single('file'), dataRoutes(pool));

app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
});
