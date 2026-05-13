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

const uploadDir = 'uploads/teachers';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/teachers/')
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

// GET all teachers
router.get("/Get_All_teachers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT teacher_id, full_name, email, profile_image_url, is_active, created_at FROM teachers ORDER BY teacher_id DESC"
    );
    res.status(200).json({
      success: true,
      teachers: result.rows
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET single teacher by ID
router.get("/Get_teacher/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT teacher_id, full_name, email, profile_image_url, is_active, created_at FROM teachers WHERE teacher_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      success: true,
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// DELETE teacher
router.delete("/Delete_teacher/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM teachers WHERE teacher_id = $1 RETURNING teacher_id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// UPDATE teacher
router.put("/Update_teacher/:id", upload.single('profile_image'), async (req, res) => {
  const { id } = req.params;
  const { full_name, email, password_hash, is_active } = req.body;
    let profile_image_url = null;
    if (req.file) {
      profile_image_url = `/uploads/teachers/${req.file.filename}`;
    }
    try {
    const result = await pool.query(
      `UPDATE teachers SET 
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        password_hash = COALESCE($3, password_hash),
        profile_image_url = COALESCE($4, profile_image_url),
        is_active = COALESCE($5, is_active)
      WHERE teacher_id = $6
      RETURNING teacher_id, full_name, email, profile_image_url, is_active`,
      [full_name, email, password_hash, profile_image_url, is_active === 'true' || is_active === true || true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// CREATE teacher
router.post("/Create_teacher", upload.single('profile_image'), async (req, res) => {
  try {
    // Get form data
    const { full_name, email, password_hash, is_active } = req.body;
    
    // Get uploaded file info
    let profile_image_url = null;
    if (req.file) {
      profile_image_url = `/uploads/teachers/${req.file.filename}`;
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
      `INSERT INTO teachers (full_name, email, password_hash, profile_image_url, is_active) 
       VALUES ($1, $2, $3, $4, $5) RETURNING teacher_id, full_name, email, profile_image_url, is_active`,
      [full_name, email, password_hash, profile_image_url, is_active === 'true' || is_active === true || true]
    );

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating teacher:", error);
    
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