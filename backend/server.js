// Blood Donation Management System using Node.js, Express, MySQL

// This is a backend server using Express
// Entities covered: Donor, Donation (weak), Blood_Bank, Hospital, Blood_Request

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ibrahim$54321', // Use your MySQL password
  database: 'blood_donation'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// ----- TABLE CREATION LOGIC (RUN ONLY ONCE) -----
// Uncomment and run once to set up the database tables
/*
const createTables = () => {
  db.query(`
    CREATE TABLE IF NOT EXISTS Donor (
      Donor_ID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(100),
      Gender ENUM('Male', 'Female', 'Other'),
      Date_of_Birth DATE,
      Blood_Type VARCHAR(5)
    );
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS Phone_Number (
      Donor_ID INT,
      Phone_Number VARCHAR(15),
      FOREIGN KEY (Donor_ID) REFERENCES Donor(Donor_ID)
    );
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS Donation (
      Donation_ID INT AUTO_INCREMENT PRIMARY KEY,
      Donor_ID INT,
      Date DATE,
      Quantity INT,
      Location VARCHAR(100),
      FOREIGN KEY (Donor_ID) REFERENCES Donor(Donor_ID)
    );
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS Blood_Bank (
      Bank_ID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(100),
      Location VARCHAR(100),
      Capacity INT,
      Contact_Number VARCHAR(15)
    );
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS Hospital (
      Hospital_ID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(100),
      Location VARCHAR(100),
      Contact_Number VARCHAR(15)
    );
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS Blood_Request (
      Request_ID INT AUTO_INCREMENT PRIMARY KEY,
      Hospital_ID INT,
      Bank_ID INT,
      Blood_Type_Required VARCHAR(5),
      Quantity_Required INT,
      Urgency_Level VARCHAR(10),
      Request_Date DATE,
      FOREIGN KEY (Hospital_ID) REFERENCES Hospital(Hospital_ID),
      FOREIGN KEY (Bank_ID) REFERENCES Blood_Bank(Bank_ID)
    );
  `);
};
createTables();
*/

// ----------- ROUTES -----------

// Add Donor and Phone Numbers
app.post('/add-donor', (req, res) => {
  const { name, gender, dob, blood_type, phone_numbers } = req.body;

  db.query('INSERT INTO Donor (Name, Gender, Date_of_Birth, Blood_Type) VALUES (?, ?, ?, ?)',
    [name, gender, dob, blood_type],
    (err, result) => {
      if (err) return res.status(500).send(err);

      const donorId = result.insertId;
      const phoneInserts = phone_numbers.map(phone => [donorId, phone]);

      db.query('INSERT INTO Phone_Number (Donor_ID, Phone_Number) VALUES ?', [phoneInserts], (err2) => {
        if (err2) return res.status(500).send(err2);
        res.send({ message: 'Donor added successfully', donorId });
      });
    });
});

// Add Donation
app.post('/add-donation', (req, res) => {
  const { donor_id, date, quantity, location } = req.body;
  db.query('INSERT INTO Donation (Donor_ID, Date, Quantity, Location) VALUES (?, ?, ?, ?)',
    [donor_id, date, quantity, location],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Donation recorded', donationId: result.insertId });
    });
});

// Add Blood Bank
app.post('/add-blood-bank', (req, res) => {
  const { name, location, capacity, contact } = req.body;
  db.query('INSERT INTO Blood_Bank (Name, Location, Capacity, Contact_Number) VALUES (?, ?, ?, ?)',
    [name, location, capacity, contact],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Blood bank added', bankId: result.insertId });
    });
});

// Add Hospital
app.post('/add-hospital', (req, res) => {
  const { name, location, contact } = req.body;
  db.query('INSERT INTO Hospital (Name, Location, Contact_Number) VALUES (?, ?, ?)',
    [name, location, contact],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Hospital added', hospitalId: result.insertId });
    });
});

// Add Blood Request
app.post('/add-request', (req, res) => {
  const { hospital_id, bank_id, blood_type, quantity, urgency, date } = req.body;
  db.query('INSERT INTO Blood_Request (Hospital_ID, Bank_ID, Blood_Type_Required, Quantity_Required, Urgency_Level, Request_Date) VALUES (?, ?, ?, ?, ?, ?)',
    [hospital_id, bank_id, blood_type, quantity, urgency, date],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Request added', requestId: result.insertId });
    });
});

// ----------- SERVER -----------

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
