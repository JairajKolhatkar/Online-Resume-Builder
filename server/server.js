const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'f4928fc425639fa0c694e192b7958dbb3c9eb4ccf5a50270',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// API Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/resumes', require('./routes/api/resumes'));

// Define specific routes for different HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, 'template-selection.html'));
});

app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/multi-step', (req, res) => {
  res.sendFile(path.join(__dirname, 'multi-step-resume.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something broke!', error: err.message });
});

// Catch-all route to serve the login page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Resume Builder app running at http://localhost:${port}`);
  console.log(`To use the application, open your browser and navigate to http://localhost:${port}`);
}); 