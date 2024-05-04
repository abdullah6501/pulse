const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const pdf = require('pdfkit');

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
  password: 'root@123',
  database: 'pulse'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});

app.post('/sendPDF', (req, res) => {
  const { email, employee } = req.body;

  // Generate PDF
  const doc = new pdf();
  // doc.pipe(fs.createWriteStream('employee_details.pdf'));

  // Create a write stream to save the PDF
  const pdfStream = fs.createWriteStream('employee_details.pdf');

  // Pipe the PDF document to the write stream
  doc.pipe(pdfStream);

  // Define table headers
  const headers = ['Name',
    'Age',
    'Date of Birth',
    'Gender',
    'Marital Status',
    'Blood Group',
    'Nationality',
    'Current Location',
    'Permanent Location',
    'Phone',
    'Email',
    'Language Known',
    'Aadhar',
    'Pan Card',
    'Passport',
    'Employee Relation Name',
    'Employee Relationship',
    'Employee Relation Number'];

  // Define table rows with employee details
  const rows = [
    [employee.Emp_Name,
    employee.Age,
    employee.DOB,
    employee.Gender,
    employee.Marital_Status,
    employee.Blood_Group,
    employee.Nationality,
    employee.Current_Location,
    employee.Permanent_Location,
    employee.Phone,
    employee.Email,
    employee.Language_Known,
    employee.Aadhar,
    employee.PanCard,
    employee.Passport,
    employee.E_Name,
    employee.E_Relationship,
    employee.E_Phone]
  ];

  // Set initial x and y coordinates for the table
  let startX = 50;
  let startY = 50;

  // Set cell padding
  const padding = 10;

  // Set column width
  const columnWidth = 200;

  // Draw table headers
  doc.font('Helvetica-Bold').fontSize(12);
  headers.forEach((header, index) => {
    doc.text(header, startX, startY + index * 20);
  });

  // Draw table rows
  doc.font('Helvetica').fontSize(10);
  rows[0].forEach((cell, index) => {
    const header = headers[index];
    const text = `${cell}`;
    doc.text(text, startX + columnWidth, startY + index * 20);
  });

  doc.end();

  // Send email with PDF attachment to the specified recipient
  const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
      user: 'abdullahsm0111@gmail.com',
      pass: 'hysb osgh jgnf psyx'
    }
  });

  const mailOptions = {
    from: 'abdullahsm0111@gmail.com',
    to: email,
    subject: 'Employee Details PDF',
    text: 'Attached are the details of the employee',
    attachments: [
      {
        filename: 'employee_details.pdf',
        path: 'employee_details.pdf'
      }
    ]
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent successfully:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});


//generate email

app.post('/store-email', (req, res) => {
  const { Aadhar, email } = req.body;
  const query = `UPDATE emp_info SET genEmail = ? WHERE Aadhar = ?`;
  db.query(query, [email, Aadhar], (err, result) => {
    if (err) {
      console.error('Error storing email in database:', err);
      res.status(500).json({ error: 'Error storing email in database' });
      return;
    }
    console.log('Email stored successfully');
    res.status(200).json({ message: 'Email stored successfully' });
  });
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
  const startsWith = req.query.startsWith;

  // Define the SQL query and query parameters based on whether startsWith is provided
  let sqlQuery;
  let queryParams = [];

  if (startsWith) {
    // Filter data based on the startsWith query parameter
    sqlQuery = `SELECT *, HEX(profile_image) AS profile_image FROM emp_info WHERE Emp_Name LIKE ?`;
    queryParams = [`${startsWith}%`];
  } else {
    // Return all employee data when no startsWith parameter is provided
    sqlQuery = `SELECT *, HEX(profile_image) AS profile_image FROM emp_info`;
  }

  // Execute the query
  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }

    // Process each item in the results to convert hex-encoded images to base64 URLs
    results.forEach(item => {
      if (item.profile_image !== null) {
        // Convert hex string to a Buffer
        const imageBuffer = Buffer.from(item.profile_image, 'hex');
        // Convert the Buffer to base64
        const base64Image = imageBuffer.toString('base64');
        // Set profile_image_url as data URL for images
        item.profile_image_url = `data:image/jpeg;base64,${base64Image}`;
      }
    });

    // Send the results as a JSON response
    res.json(results);
  });
});


// app.get('/api/emp_info', (req, res) => {
//     const startsWith = req.query.startsWith;

//     // Define the SQL query and query parameters based on whether startsWith is provided
//     let sqlQuery;
//     let queryParams = [];

//     if (startsWith) {
//         // Filter data based on the startsWith query parameter
//         sqlQuery = `SELECT *, HEX(profile_image) AS profile_image FROM emp_info WHERE Emp_Name LIKE ?`;
//         queryParams = [`${startsWith}%`];
//     } else {
//         // Return all employee data when no startsWith parameter is provided

//         sqlQuery = `SELECT *, HEX(profile_image) AS profile_image FROM emp_info`;
//     }

//     // Execute the query
//     db.query(sqlQuery, queryParams, (err, results) => {
//         if (err) {
//             console.error('Error fetching data from the database:', err);
//             res.status(500).json({ error: 'Error fetching data' });
//         }
//         else {
//             // Process the results to convert hex-encoded images to base64 URL
//             results.forEach(item => {
//                 if (item.profile_image !== null) {
//                     const hexString = item.profile_image;
//                     // Convert hex string to Buffer and then to base64
//                     const imageBuffer = Buffer.from(hexString, 'hex');
//                     const base64Image = imageBuffer.toString('base64');
//                     // Set profile_image_url as data URL for images
//                     item.profile_image_url = `data:image/jpeg;base64,${base64Image}`;
//                 }
//             });

//             // Send the results as JSON response
//             res.json(results);
//         }

//     });

// });


// app.get('/api/emp_info', (req, res) => {
//   const sql = 'SELECT *, HEX(profile_image) AS profile_image FROM emp_info';

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error fetching items:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     // Process each item in the result
//     result.forEach(item => {
//       if (item.profile_image !== null) {
//         const hexString = item.profile_image;
//         const imageUrl = Buffer.from(hexString, 'hex').toString();
//         item.profile_image_url = imageUrl;
//       }
//     });

//     // Send the JSON response with the processed result array
//     res.json(result);
//   });
// });


// app.get('/api/emp_info', (req, res) => {
//     const startsWith = req.query.startsWith;

//     // Check if startsWith parameter is provided
//     if (!startsWith) {
//         res.status(400).json({ error: 'Please provide a search query' });
//         return;
//     }

//     // Define the SQL query
//     const sqlQuery = `SELECT * FROM emp_info WHERE Emp_Name LIKE ?`;

//     // Execute the query with the provided startsWith parameter
//     db.query(sqlQuery, [`${startsWith}%`], (err, results) => {
//         if (err) {
//             console.error('Error fetching data from the database:', err);
//             res.status(500).json({ error: 'Error fetching data' });
//         } else {
//             res.json(results);
//         }
//     });
// });C:\Users\Admin\Downloads\pulse (3)\pulse\src\app\admin\admin.component.html

// app.get('/api/emp_info/:Emp_Name', (req, res) => {
//   const id = req.params.Emp_Name;
//   const sqlActive = `SELECT * FROM emp_info WHERE Emp_Name=${id}`;
//   const sqlAny = `SELECT * FROM emp_info WHERE Emp_Name=${id}`;

//   db.query(sqlActive, (errActive, resultActive) => {
//     if (errActive) {
//       console.error('Error fetching active item:', errActive);
//       res.status(500).json({ error: 'Error fetching active item' });
//     } else if (resultActive.length > 0) {
//       res.json(resultActive);
//     } else {
//       // If the item is not found in active items, check any items regardless of is_deleted
//       db.query(sqlAny, (errAny, resultAny) => {
//         if (errAny) {
//           console.error('Error fetching item:', errAny);
//           res.status(500).json({ error: 'Error fetching item' });
//         } else if (resultAny.length > 0) {
//           // If the item is found, but it's deactivated, return an error indicating it's deactivated
//           res.status(400).json({ error: 'Item is deactivated' });
//         } else {
//           // If the item is not found, return an error indicating that the item is not found
//           res.status(404).json({ error: 'Item not found' });
//         }
//       });
//     }
//   });
// });
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

//showing profile for admin
app.get('/api/profile', (req, res) => {
  const sql = 'SELECT *, HEX(profile_image) AS profile_image FROM profile';


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
    res.json(result);
    console.log(result);


  });

});


//showing education for admin
app.get('/api/education', (req, res) => {
  const sql = 'SELECT * FROM education';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.json({ error: 'Error fetching items' });
    } else {
      res.json(result);
    }
  });
});
app.get('/api/experience', (req, res) => {
  const sql = 'SELECT * FROM experience';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.json({ error: 'Error fetching items' });
    } else {
      res.json(result);
      console.log(result)
    }
  });
});


//education
app.get('/api/education/:Aadhar', (req, res) => {
  const id = req.params.Aadhar;
  const sqlActive = `SELECT * FROM education WHERE Aadhar=${id}`;
  const sqlAny = `SELECT * FROM education WHERE Aadhar=${id}`;

  db.query(sqlActive, (errActive, resultActive) => {
    if (errActive) {
      console.error('Error fetching active item:', errActive);
      res.status(500).json({ error: 'Error fetching active item' });
    } else if (resultActive.length > 0) {
      res.json(resultActive);
    } else {
      // If the item is not found in active items, check any items regardless of is_deleted
      db.query(sqlAny, (errAny, resultAny) => {
        if (errAny) {
          console.error('Error fetching item:', errAny);
          res.status(500).json({ error: 'Error fetching item' });
        } else if (resultAny.length > 0) {
          // If the item is found, but it's deactivated, return an error indicating it's deactivated
          res.status(400).json({ error: 'Item is deactivated' });
        } else {
          // If the item is not found, return an error indicating that the item is not found
          res.status(404).json({ error: 'Item not found' });
        }
      });
    }
  });
});

app.get('/api/experience/:Aadhar', (req, res) => {
  const id = req.params.Aadhar;
  const sqlActive = `SELECT * FROM experience WHERE Aadhar=${id}`;
  const sqlAny = `SELECT * FROM experience WHERE Aadhar=${id}`;

  db.query(sqlActive, (errActive, resultActive) => {
    if (errActive) {
      console.error('Error fetching active item:', errActive);
      res.status(500).json({ error: 'Error fetching active item' });
    } else if (resultActive.length > 0) {
      res.json(resultActive);
    } else {
      // If the item is not found in active items, check any items regardless of is_deleted
      db.query(sqlAny, (errAny, resultAny) => {
        if (errAny) {
          console.error('Error fetching item:', errAny);
          res.status(500).json({ error: 'Error fetching item' });
        } else if (resultAny.length > 0) {
          // If the item is found, but it's deactivated, return an error indicating it's deactivated
          res.status(400).json({ error: 'Item is deactivated' });
        } else {
          // If the item is not found, return an error indicating that the item is not found
          res.status(404).json({ error: 'Item not found' });
        }
      });
    }
  });
});


app.put('/api/profile/:aadhar/toggle', (req, res) => {
  const { aadhar } = req.params;
  const sql = 'UPDATE profile SET is_deleted = (CASE WHEN is_deleted = 1 THEN 0 ELSE 1 END) WHERE Aadhar = ?';
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


// Inside your Node.js server setup
// Profile
app.post('/api/profile/add', (req, res) => {
  const { First_Name, Middle_Name, Last_Name, DOB, Email, Phone, Father_Name, Gender, Marital_Status, Aadhar, Hobbies, Language_Known, Permanent_Address, Temporary_Address, profile_image } = req.body;
  const sql = 'INSERT INTO profile ( First_Name, Middle_Name, Last_Name, DOB, Email, Phone, Father_Name, Gender, Marital_Status, Aadhar, Hobbies, Language_Known, Permanent_Address, Temporary_Address,profile_image ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
  db.query(sql, [First_Name, Middle_Name, Last_Name, DOB, Email, Phone, Father_Name, Gender, Marital_Status, Aadhar, Hobbies, Language_Known, Permanent_Address, Temporary_Address, profile_image], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).json({ error: 'Error adding item' });
    }
    else {
      console.log('Item added successfully');
      res.json({ First_Name, Middle_Name, Last_Name, DOB, Email, Phone, Father_Name, Gender, Marital_Status, Aadhar, Hobbies, Language_Known, Permanent_Address, Temporary_Address, profile_image });
    }
  });
});

// Education
app.post('/api/education/add', (req, res) => {
  const { Aadhar, Qualification, Discipline, School_College_Institute, Affiliated_Board_University, Marks_CGPA, Year_Enrollment, Year_Passed } = req.body;
  const sql = 'INSERT INTO education ( Aadhar, Qualification, Discipline, School_College_Institute, Affiliated_Board_University, Marks_CGPA, Year_Enrollment, Year_Passed ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [Aadhar, Qualification, Discipline, School_College_Institute, Affiliated_Board_University, Marks_CGPA, Year_Enrollment, Year_Passed], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).json({ error: 'Error adding item' });
    }
    else {
      console.log('Item added successfully');
      res.json({ Aadhar, Qualification, Discipline, School_College_Institute, Affiliated_Board_University, Marks_CGPA, Year_Enrollment, Year_Passed });
    }
  });
});

//Experience
app.post('/api/experience/add', (req, res) => {
  const { Aadhar, CompanyName, DesignationDepartmentEmployeeNo, AddressTelephone, ReportingManagerDetails, EmploymentDates, AnnualCTC } = req.body;
  const sql = 'INSERT INTO experience ( Aadhar, CompanyName, DesignationDepartmentEmployeeNo, AddressTelephone, ReportingManagerDetails, EmploymentDates, AnnualCTC ) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [Aadhar, CompanyName, DesignationDepartmentEmployeeNo, AddressTelephone, ReportingManagerDetails, EmploymentDates, AnnualCTC], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).json({ error: 'Error adding item' });
    }
    else {
      console.log('Item added successfully');
      res.json({ Aadhar, CompanyName, DesignationDepartmentEmployeeNo, AddressTelephone, ReportingManagerDetails, EmploymentDates, AnnualCTC });
    }
  });
});

app.get('/api/emp_info/:Aadhar', (req, res) => {
  const id = req.params.Aadhar;
  const sqlActive = `SELECT * FROM emp_info WHERE Aadhar=${id}`;
  const sqlAny = `SELECT * FROM emp_info WHERE Aadhar=${id}`;

  db.query(sqlActive, (errActive, resultActive) => {
    if (errActive) {
      console.error('Error fetching active item:', errActive);
      res.status(500).json({ error: 'Error fetching active item' });
    } else if (resultActive.length > 0) {
      res.json(resultActive);
    } else {
      // If the item is not found in active items, check any items regardless of is_deleted
      db.query(sqlAny, (errAny, resultAny) => {
        if (errAny) {
          console.error('Error fetching item:', errAny);
          res.status(500).json({ error: 'Error fetching item' });
        } else if (resultAny.length > 0) {
          // If the item is found, but it's deactivated, return an error indicating it's deactivated
          res.status(400).json({ error: 'Item is deactivated' });
        } else {
          // If the item is not found, return an error indicating that the item is not found
          res.status(404).json({ error: 'Item not found' });
        }
      });
    }
  });
});

// app.put('/api/emp_info/:Aadhar', (req, res) => {
//   const idd = req.params.Aadhar; // Parse ID as an integer
//   const newData = req.body; // Assuming request body contains updated data

//   // Check if ID is undefined or not a number
//   if (isNaN(idd)) {
//     console.log('Invalid or missing ID');
//     return res.status(400).json({ error: 'Invalid or missing ID' });
//   }

//   const query = 'UPDATE emp_info SET ? WHERE Aadhar = ?';
//   db.query(query, [newData, idd], (err, result) => {
//     if (err) {
//       console.log('Error updating profile:', err);
//       return res.status(500).json({ error: 'Error updating profile' });
//     }
//     console.log('Education updated successfully');
//     res.json({ message: 'Education updated successfully' });
//   });
// });
app.put('/api/emp_info/:Aadhar', (req, res) => {
  const idd = parseInt(req.params.Aadhar); // Parse ID as an integer
  const newData = req.body; // Assuming request body contains updated data


  // Check if ID is undefined or not a number
  if (isNaN(idd)) {
    console.error('Invalid or missing Aadhar');
    return res.status(400).json({ error: 'Invalid or missing Aadhar' });
  }


  // Convert date format for DOB
  if (newData.DOB) {
    const dob = new Date(newData.DOB);
    newData.DOB = dob.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  }


  const query = 'UPDATE emp_info SET ? WHERE Aadhar = ?';
  db.query(query, [newData, idd], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Error updating profile' });
    }
    console.log('Profile updated successfully');
    res.json({ message: 'Profile updated successfully' });
  });
});
//Updating education form
app.get('/api/education/:Aadhar', (req, res) => {
  const id = req.params.Aadhar;
  const sqlActive = `SELECT * FROM education WHERE Aadhar=${id}`;
  const sqlAny = `SELECT * FROM education WHERE Aadhar=${id}`;

  db.query(sqlActive, (errActive, resultActive) => {
    if (errActive) {
      console.error('Error fetching active item:', errActive);
      res.status(500).json({ error: 'Error fetching active item' });
    } else if (resultActive.length > 0) {
      res.json(resultActive);
    } else {
      // If the item is not found in active items, check any items regardless of is_deleted
      db.query(sqlAny, (errAny, resultAny) => {
        if (errAny) {
          console.error('Error fetching item:', errAny);
          res.status(500).json({ error: 'Error fetching item' });
        } else if (resultAny.length > 0) {
          // If the item is found, but it's deactivated, return an error indicating it's deactivated
          res.status(400).json({ error: 'Item is deactivated' });
        } else {
          // If the item is not found, return an error indicating that the item is not found
          res.status(404).json({ error: 'Item not found' });
        }
      });
    }
  });
});

app.get('/api/emp_info/:Emp_Name', (req, res) => {
  const id = req.params.Emp_Name;
  const sqlActive = `SELECT * FROM education WHERE Emp_Name=${id}`;
  const sqlAny = `SELECT * FROM education WHERE Emp_Name=${id}`;

  db.query(sqlActive, (errActive, resultActive) => {
    if (errActive) {
      console.error('Error fetching active item:', errActive);
      res.status(500).json({ error: 'Error fetching active item' });
    } else if (resultActive.length > 0) {
      res.json(resultActive);
    } else {
      // If the item is not found in active items, check any items regardless of is_deleted
      db.query(sqlAny, (errAny, resultAny) => {
        if (errAny) {
          console.error('Error fetching item:', errAny);
          res.status(500).json({ error: 'Error fetching item' });
        } else if (resultAny.length > 0) {
          // If the item is found, but it's deactivated, return an error indicating it's deactivated
          res.status(400).json({ error: 'Item is deactivated' });
        } else {
          // If the item is not found, return an error indicating that the item is not found
          res.status(404).json({ error: 'Item not found' });
        }
      });
    }
  });
});
// Updating the education using Aadhar and Qualification

app.get('/api/education/:Aadhar/:Qualification', (req, res) => {
  const { Aadhar, Qualification } = req.params;


  // SQL query to fetch the education record by Aadhar number and qualification
  const sqlQuery = `SELECT * FROM education WHERE Aadhar = ? AND Qualification = ?`;


  // Execute the query with parameterized values to prevent SQL injection
  db.query(sqlQuery, [Aadhar, Qualification], (err, result) => {
    if (err) {
      console.log('Error fetching item:', err);
      return res.status(500).json({ error: 'Error fetching item' });
    } else if (result.length > 0) {
      // If the record is found, return the result
      res.json(result);
      console.log(result);
    } else {
      // If the record is not found, return a 404 error
      res.status(404).json({ error: 'Item not found' });
      console.log(err);
    }
  });
});

app.put('/api/education/:Aadhar/:Qualification', (req, res) => {
  const Aadhar = req.params.Aadhar;
  const Qualification = req.params.Qualification;
  const updatedData = req.body;


  // Check if Aadhar and qualification are provided
  if (!Aadhar || !Qualification) {
    return res.status(400).json({ error: 'Aadhar and qualification must be provided' });
  }


  // Construct the SQL query to update education details
  const sqlQuery = `UPDATE education SET ? WHERE Aadhar = ? AND qualification = ?`;


  // Execute the query with parameterized values to prevent SQL injection
  db.query(sqlQuery, [updatedData, Aadhar, Qualification], (err, result) => {
    if (err) {
      console.error('Error updating education details:', err);
      return res.status(500).json({ error: 'Error updating education details' });
    }
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Education details not found' });
    }
    // Return success message
    res.json({ message: 'Education details updated successfully' });
  });
});

//Updating the experience using aadhar and company name

app.get('/api/experience/:Aadhar/:CompanyName', (req, res) => {
  const { Aadhar, CompanyName } = req.params;


  // SQL query to fetch the education record by Aadhar number and company name
  const sqlQuery = `SELECT * FROM experience WHERE Aadhar = ? AND CompanyName = ?`;


  // Execute the query with parameterized values to prevent SQL injection
  db.query(sqlQuery, [Aadhar, CompanyName], (err, result) => {
    if (err) {
      console.log('Error fetching item:', err);
      return res.status(500).json({ error: 'Error fetching item' });
    } else if (result.length > 0) {
      // If the record is found, return the result
      res.json(result);
      console.log(result);
    } else {
      // If the record is not found, return a 404 error
      res.status(404).json({ error: 'Item not found' });
      console.log(err);
    }
  });
});

app.put('/api/experience/:Aadhar/:CompanyName', (req, res) => {
  const Aadhar = req.params.Aadhar;
  const CompanyName = req.params.CompanyName;
  const updatedData = req.body;


  // Check if Aadhar and company name are provided
  if (!Aadhar || !CompanyName) {
    return res.status(400).json({ error: 'Aadhar and CompanyName must be provided' });
  }


  // Construct the SQL query to update education details
  const sqlQuery = `UPDATE experience SET ? WHERE Aadhar = ? AND CompanyName = ?`;


  // Execute the query with parameterized values to prevent SQL injection
  db.query(sqlQuery, [updatedData, Aadhar, CompanyName], (err, result) => {
    if (err) {
      console.error('Error updating experience details:', err);
      return res.status(500).json({ error: 'Error updating experience details' });
    }
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Experience details not found' });
    }
    // Return success message
    res.json({ message: 'Experience details updated successfully' });
  });
});

/////////////////////////////////////////
app.put('/api/experience/:Aadhar', (req, res) => {
  const idd = req.params.Aadhar; // Parse ID as an integer
  const newData = req.body; // Assuming request body contains updated data

  // Check if ID is undefined or not a number
  if (isNaN(idd)) {
    console.log('Invalid or missing ID');
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  const query = 'UPDATE experience SET ? WHERE Aadhar = ?';
  db.query(query, [newData, idd], (err, result) => {
    if (err) {
      console.log('Error updating profile:', err);
      return res.status(500).json({ error: 'Error updating profile' });
    }
    console.log('Education updated successfully');
    res.json({ message: 'experience updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
