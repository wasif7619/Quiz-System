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

// LOGIN for Admin
router.post("/login", async (req, res) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check in admin table
    const result = await pool.query(
      "SELECT  email, full_name, password_hash,admin_image FROM admin WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result.rows[0];

    // Compare password_hash directly
    if (admin.password_hash !== password_hash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { 
        admin_id: admin.admin_id, 
        email: admin.email,
        full_name: admin.full_name,
        role: 'admin'
      },
      process.env.jwt_token,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token: token,
      admin: {
        admin_id: admin.admin_id,
        full_name: admin.full_name,
        email: admin.email,
        password_hash: admin.password_hash,
        admin_image: admin.admin_image,
        role: 'admin'
      },
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const admin = result.rows[0];
    const password = admin.password_hash;
    console.log(`Password for ${email}: ${password}`);
   
    res.status(200).json({
      success: true,
      message: "Password sent to your email address",
      password: password 
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;