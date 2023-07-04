const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Priya@12345",
  database: "sampleapplication"
});

// Login endpoint
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const query = 'SELECT * FROM user WHERE username = ?';
  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Successful login
    return res.status(200).json({ message: 'Login successful' });
  });
});


app.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employee_entity";

  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'An error occurred while fetching employees.' });
    }

    return res.json(data);
  });
});

app.post("/employee", (req, res) => {
  const { name, age, sex, email, salary, department } = req.body;

  const query = "INSERT INTO employee_entity (`name`, `age`, `sex`, `email`, `salary`, `department`) VALUES (?, ?, ?, ?, ?, ?)";
  pool.query(query, [name, age, sex, email, salary, department], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).json({ error: 'An error occurred while adding the employee.' });
    }

    return res.json({ success: true, message: 'Employee added successfully.' });
  });
});

app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, sex, email, salary, department } = req.body;

  const query = "UPDATE employee_entity SET `name` = ?, `age` = ?, `sex` = ?, `email` = ?, `salary` = ?, `department` = ? WHERE ID = ?";
  const values = [name, age, sex, email, salary, department, id];

  pool.query(query, values, (err, data) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ error: 'An error occurred while updating the employee.' });
    }

    return res.json({ success: true, message: 'Employee updated successfully.' });
  });
});

app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM employee_entity WHERE ID = ?";
  pool.query(query, [id], (err, data) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the employee.' });
    }

    return res.json({ success: true, message: 'Employee deleted successfully.' });
  });
});

app.get('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const query = "SELECT * FROM employee_entity WHERE id = ?";
  pool.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      return res.status(500).json({ error: 'An error occurred while fetching employee details.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = results[0];
    return res.status(200).json(employee);
  });
});
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});








