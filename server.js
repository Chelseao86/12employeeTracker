const PORT = process.env.PORT || 3001;
const express = require('express')
const app = express();
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: '',
    // Your MySQL password
    password: 'Oscar886',
    database: 'employees'
  },
  console.log('Connected to the employees database.')
);

// Get all employees
app.get('/api/employee', (req, res) => {
  const sql = `SELECT * FROM employee`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});
;




app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

