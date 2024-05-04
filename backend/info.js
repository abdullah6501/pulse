const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs'); // Import the 'fs' module to read files
const { log } = require('console');
const uploadsDirectory = path.join(__dirname, 'uploads');


const app = express();
const PORT = 8090;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static(path.join(__dirname, 'images')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pozent@123',
  database: 'pulse'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});

app.post('/api/emp_info/add', upload.single('profile_image'), (req, res) => {
  const {
    Emp_Name,
    Age,
    DOB,
    Gender,
    Marital_Status,
    Blood_Group,
    Nationality,
    Current_Location,
    Permanent_Location,
    Phone,
    Email,
    Language_Known,
    Aadhar,
    PanCard,
    Passport,
    E_Relationship,
    E_Name,
    E_Phone
  } = req.body;

  const imageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO emp_info (
      profile_image, Emp_Name, Age, DOB, Gender, Marital_Status, Blood_Group, Nationality, Current_Location, Permanent_Location,
      Phone, Email, Language_Known, Aadhar, PanCard, Passport, E_Relationship, E_Name, E_Phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    imageUrl,
    Emp_Name,
    Age,
    DOB,
    Gender,
    Marital_Status,
    Blood_Group,
    Nationality,
    Current_Location,
    Permanent_Location,
    Phone,
    Email,
    Language_Known,
    Aadhar,
    PanCard,
    Passport,
    E_Relationship,
    E_Name,
    E_Phone
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      return res.status(500).json({ error: 'Error adding item' });
    }

    console.log('Item added successfully');
    res.json({
      profile_image: imageUrl,
      Emp_Name,
      Age,
      DOB,
      Gender,
      Marital_Status,
      Blood_Group,
      Nationality,
      Current_Location,
      Permanent_Location,
      Phone,
      Email,
      Language_Known,
      Aadhar,
      PanCard,
      Passport,
      E_Relationship,
      E_Name,
      E_Phone
    });
  });
});


app.get('/api/emp_info', (req, res) => {
  const sql = 'SELECT *, HEX(profile_image) AS profile_image FROM emp_info';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Process each item in the result
    result.forEach(item => {
      if (item.profile_image !== null) {
        const hexString = item.profile_image;
        const imageUrl = Buffer.from(hexString, 'hex').toString();
        item.profile_image_url = imageUrl;
      }
    });

    // Send the JSON response with the processed result array
    res.json(result);
  });
});


app.get('/api/emp_info/:Aadhar', (req, res) => {
  const userAadhar = req.params.Aadhar;
  const sql = 'SELECT *, HEX(profile_image) AS profile_image FROM emp_info WHERE Aadhar = ?';

  db.query(sql, [userAadhar], (err, result) => {
    if (err) {
      console.error('Error fetching user by Aadhar:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    result.forEach(item => {
      if (item.emp_info_image !== null) {
        const hexString = item.emp_info_image;
        const imageUrl = Buffer.from(hexString, 'hex').toString();
        item.emp_info_image_url = imageUrl;
      }
    });

    if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});
// app.put('/api/emp_info/:Aadhar/deactivate', (req, res) => {
//   const { Aadhar } = req.params;
//   const sql = 'UPDATE emp_info SET is_deleted = 1 WHERE Aadhar = ?';
//   db.query(sql, [Aadhar], (err, result) => {
//     if (err) {
//       console.error('Error deactivating employee:', err);
//       res.status(500).json({ error: 'Error deactivating employee' });
//     } else {
//       console.log('Employee deactivated successfully');
//       res.json(result);
//     }
//   });
// });

// app.put('/api/emp_info/:Aadhar/activate', (req, res) => {
//   const { Aadhar } = req.params;
//   const sql = 'UPDATE emp_info SET is_deleted = 0 WHERE Aadhar = ?';
//   db.query(sql, [Aadhar], (err, result) => {
//     if (err) {
//       console.error('Error activating employee:', err);
//       res.status(500).json({ error: 'Error activating employee' });
//     } else {
//       console.log('Employee activated successfully');
//       res.json(result);
//     }
//   });
// });

app.put('/api/emp_info/:aadhar/toggle', (req, res) => {
  const { aadhar } = req.params;
  const sql = 'UPDATE emp_info SET is_deleted = (CASE WHEN is_deleted = 1 THEN 0 ELSE 1 END) WHERE Aadhar = ?';
  db.query(sql, [aadhar], (err, result) => {
    if (err) {
      console.error('Error toggling employee activation:', err);
      res.status(500).json({ error: 'Error toggling employee activation' });
    } else {
      console.log('Employee activation status toggled successfully');
      res.json(result);
    }
  });
});

app.put('/api/emp_info/:Aadhar', (req, res) => {
  const Aadhard = parseInt(req.params.Aadhar); // Parse Aadhar as an integer
  const newData = req.body; // Assuming request body contains updated data

  // Check if Aadhar is undefined or not a number
  if (isNaN(Aadhard)) {
    console.error('InvalAadhar or missing Aadhar');
    return res.status(400).json({ error: 'InvalAadhar or missing Aadhar' });
  }

  // Convert date format for DOB
  if (newData.DOB) {
    const dob = new Date(newData.DOB);
    newData.DOB = dob.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  }

  const query = 'UPDATE emp_info SET ? WHERE Aadhar = ?';
  db.query(query, [newData, Aadhard], (err, result) => {
    if (err) {
      console.error('Error updating emp_info:', err);
      return res.status(500).json({ error: 'Error updating emp_info' });
    }
    console.log('emp_info updated successfully');
    res.json({ message: 'emp_info updated successfully' });
  });
});


app.delete("/api/emp_info/delete/:Aadhar", (req, res) => {
  let sql = "DELETE FROM emp_info WHERE Aadhar=" + req.params.Aadhar + "";
  let query = db.query(sql, (error) => {
    if (error) {
      console.log(error)
      res.send({ status: false, message: "Employee Data deleted failed" });
    }
    else {
      res.send({ status: true, message: "Employee Data deleted sucessfully" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
