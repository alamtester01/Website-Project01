const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Parse JSON request body
app.use(express.json());

// Serve the login form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve the registration form
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Perform validation and registration logic here
  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }

  // Insert user into the database
  pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, password],
    (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.send('Error registering user.');
      }

      res.send('Registration successful!');
    }
  );
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check user credentials in the database
  pool.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password],
    (err, result) => {
      if (err) {
        console.error('Error checking user credentials:', err);
        return res.send('Error checking user credentials.');
      }

      if (result.rows.length === 0) {
        res.send('Invalid username or password.');
      } else {
        res.send('Login successful!');
      }
    }
  );
});

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
