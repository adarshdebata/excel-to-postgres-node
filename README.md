
# Student Data Management System

This project is a Student Data Management System built using Node.js, Express, and PostgreSQL. The application allows you to upload Excel files containing student data, convert the data to JSON format, and then save the data to a PostgreSQL database. It includes validation and formatting checks to ensure data integrity and logs all responses.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload Excel files (.xlsx or .xls)
- Convert Excel data to JSON
- Save data to PostgreSQL database
- Validate data and check formats
- Update existing records or create new ones
- Log responses to a file

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-data-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd student-data-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up the PostgreSQL database and update the `.env` file with your database credentials.

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Use a tool like Postman to send a POST request to the `/data` endpoint with an Excel file.

## Project Structure

```
student-data-app/
├── controllers/
│   └── dataController.js
├── middlewares/
│   ├── validateData.js
│   └── checkDataFormat.js
├── models/
│   └── db.js
├── routes/
│   └── dataRoutes.js
├── logs/
│   └── activity.log
├── uploads/
├── data.json
├── .gitignore
├── .env
└── index.js
```

### `index.js`

- Sets up the Express application
- Configures middleware, including `multer` for file uploads
- Defines routes and starts the server

### `controllers/dataController.js`

- Contains functions to convert Excel data to JSON and save it to the PostgreSQL database

### `middlewares/validateData.js`

- Validates the uploaded file

### `middlewares/checkDataFormat.js`

- Checks the format of the converted JSON data

### `models/db.js`

- Sets up the PostgreSQL connection pool

### `routes/dataRoutes.js`

- Defines the routes for handling data uploads and processing

## API Endpoints

### POST /data

- Upload an Excel file containing student data
- Converts the data to JSON and saves it to the PostgreSQL database

#### Request

- Content-Type: `multipart/form-data`
- File field name: `file`

#### Response

- 200 OK: `{"message": "Data processed successfully"}`
- 400 Bad Request: `{"error": "Invalid file format. Please upload an .xlsx or .xls file"}`
- 500 Internal Server Error: `{"error": "Failed to convert Excel to JSON"}`

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
DB_USER=your_db_user
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
PORT=3000
```

## Dependencies

- express: ^4.19.2
- multer: ^1.4.5-lts.1
- pg: ^8.12.0
- exceljs: ^4.4.0
- dotenv: ^16.4.5
- express-validator: ^7.1.0

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.
