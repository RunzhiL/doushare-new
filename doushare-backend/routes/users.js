const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("../firebaseAdmin");

router.post("/firebase-register", async (req, res) => {
  try {
    const { firebase_uid, email, fullName, idToken } = req.body;

    // 限制只能 Douglas 邮箱
    if (!email.endsWith("@student.douglascollege.ca")) {
      return res.status(400).json({ 
        error: "Only Douglas College student email addresses are allowed." 
      });
    }

    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    // 验证 Firebase 令牌
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (decoded.uid !== firebase_uid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 查找用户
    let user = await User.findOne({ firebase_uid });

    if (user) {
      return res.status(200).json({
        message: "User already exists",
        user
      });
    }

    // 创建用户
    user = await User.create({
      firebase_uid,
      email,
      fullName,
      role: "student"
    });

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (err) {
    console.error("firebase-register error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login-firebase", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ error: "Missing Firebase token" });

    // 验证 Firebase Token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const firebase_uid = decoded.uid;

    // 查找用户
    let user = await User.findOne({ firebase_uid });

    if (!user) {
      return res.status(404).json({ error: "User not registered in database" });
    }

    // 生成后端自己的 JWT
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token: jwtToken,
      user
    });

  } catch (err) {
    console.error("login-firebase error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
