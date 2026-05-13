const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Add this line to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const adminauth = require('./routes/admin/auth');
const adminTeacher = require('./routes/admin/Admin_Teacher');
const adminStudent = require('./routes/admin/Admin_Student');
// const adminQuiz = require('./routes/admin/Admin_Quiz');
// Use routes
app.use('/api/admin', adminauth);
app.use('/api/teachers', adminTeacher);
app.use('/api/students', adminStudent);
// app.use('/api/admin', adminQuiz);
// Start server
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});