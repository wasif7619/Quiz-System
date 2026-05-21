const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { route } = require('./Admin_Student');
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

router.post("/assign_student_to_class", async (req, res) => {
  const { student_full_name, teacher_full_name, class_name } = req.body;

  try {
    // 1. Find student
    const student = await pool.query(
      "SELECT student_id FROM students WHERE TRIM(LOWER(full_name)) = TRIM(LOWER($1))",
      [student_full_name]
    );
    
    if (student.rows.length === 0) {
      return res.status(404).json({ 
        error: "Student not found",
        message: `No student found with name: ${student_full_name}`
      });
    }
    const student_id = student.rows[0].student_id;

    // 2. Find teacher
    const teacher = await pool.query(
      "SELECT teacher_id FROM teachers WHERE TRIM(LOWER(full_name)) = TRIM(LOWER($1))",
      [teacher_full_name]
    );
    
    if (teacher.rows.length === 0) {
      return res.status(404).json({ 
        error: "Teacher not found",
        message: `No teacher found with name: ${teacher_full_name}`
      });
    }
    const teacher_id = teacher.rows[0].teacher_id;

    // 3. Update ONLY class_name in students table
    await pool.query(
      `UPDATE students SET class_name = $1 WHERE student_id = $2`,
      [class_name, student_id]
    );

    // 4. Create assignment in teacher_student_assignments table
    await pool.query(
      `INSERT INTO teacher_student_assignments (teacher_id, student_id) 
       VALUES ($1, $2) 
       ON CONFLICT (teacher_id, student_id) DO NOTHING`,
      [teacher_id, student_id]
    );

    res.status(200).json({
      success: true,
      message: `Successfully assigned ${student_full_name} to teacher ${teacher_full_name} for class ${class_name}`,
      data: {
        student_id: student_id,
        student_name: student_full_name,
        teacher_id: teacher_id,
        teacher_name: teacher_full_name,
        class_name: class_name
      }
    });

  } catch (error) {
    console.error("Error assigning student to class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get_all",async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teacher_student_assignments");
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 
// router.put("/unassigned", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM students WHERE student_id NOT IN (SELECT student_id FROM teacher_student_assignments)");
//     res.status(200).json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error("Error fetching unassigned students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
module.exports = router;