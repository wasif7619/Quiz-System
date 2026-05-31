const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get("/get_all", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      tsa.assignment_id,
      t.teacher_id,
      t.full_name AS teacher_name,
      t.profile_image_url AS profile_image_url,
      s.student_id,
      s.full_name AS student_name,
      s.profile_image_url AS student_profile_image_url,
      s.class_name,
      tsa.assigned_date
    FROM teacher_student_assignments tsa
    JOIN teachers t ON tsa.teacher_id = t.teacher_id
    JOIN students s ON tsa.student_id = s.student_id
    WHERE tsa.is_active = true`);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;