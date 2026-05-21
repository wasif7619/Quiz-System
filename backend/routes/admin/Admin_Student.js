const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// MULTER CONFIGURATION FOR IMAGE UPLOAD

const uploadDir = 'uploads/students';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/students/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// GET all students
router.get("/Get_All_students", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT student_id, full_name,class_name, email, profile_image_url, is_active, created_at FROM students ORDER BY student_id DESC"
    );
    res.status(200).json({
      success: true,
      students: result.rows
    });
  } catch (error) {
    console.error("Error fetching students :", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET single student by ID
router.get("/Get_student/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT student_id, full_name, class_name, email, profile_image_url, is_active, created_at FROM students WHERE student_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      student: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// DELETE student
router.delete("/Delete_student/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING student_id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// UPDATE student
router.put("/Update_student/:id", upload.single('profile_image'), async (req, res) => {
  const { id } = req.params;
  const { full_name, email, password_hash, is_active, class_name } = req.body;
  
  try {
    // Get current student data first
    const current = await pool.query("SELECT * FROM students WHERE student_id = $1", [id]);
    
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    const oldData = current.rows[0];
    
    // Use new values or keep old ones
    const newFullName = full_name || oldData.full_name;
    const newEmail = email || oldData.email;
    const newClassName = class_name || oldData.class_name;
    const newIsActive = (is_active === 'true' || is_active === true);
    
    // Only update password if provided
    let newPassword = oldData.password_hash;
    if (password_hash && password_hash.trim() !== '') {
      newPassword = password_hash;
    }
    
    // Only update image if uploaded
    let newImage = oldData.profile_image_url;
    if (req.file) {
      newImage = `/uploads/students/${req.file.filename}`;
    }
    
    // Update database
    const result = await pool.query(
      `UPDATE students SET 
        full_name = $1, 
        email = $2, 
        class_name = $3, 
        password_hash = $4, 
        profile_image_url = $5, 
        is_active = $6 
      WHERE student_id = $7 
      RETURNING *`,
      [newFullName, newEmail, newClassName, newPassword, newImage, newIsActive, id]
    );
    
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: result.rows[0]
    });
    
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// CREATE student
router.post("/Create_student", upload.single('profile_image'), async (req, res) => {
  try {
    // Get form data
    const { full_name, email, password_hash, is_active,class_name } = req.body;
    
    // Get uploaded file info
    let profile_image_url = null;
    if (req.file) {
      profile_image_url = `/uploads/students/${req.file.filename}`;
    }

    // Validate required fields
    if (!full_name || !email || !password_hash) {
      return res.status(400).json({ 
        success: false,
        message: "Full name, email and password are required" 
      });
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO students (full_name, email, password_hash, profile_image_url, is_active, class_name) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING student_id, full_name, email, profile_image_url, is_active`,
      [full_name, email, password_hash, profile_image_url, is_active === 'true' || is_active === true || true, class_name]
    );

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating student:", error);
    
    // Handle duplicate email error
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});
module.exports = router;