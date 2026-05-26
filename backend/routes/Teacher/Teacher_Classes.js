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

router.get("/get_classes",async(req,res)=>{
  try {
    const result = await pool.query(
      "SELECT c.class_id, c.class_name FROM classes c JOIN teachers t ON c.teacher_id = t.teacher_id WHERE t.teacher_id = $1",
      [req.teacher.teacher_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;