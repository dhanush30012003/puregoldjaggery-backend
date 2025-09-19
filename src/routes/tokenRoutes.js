const express = require("express");
const router = express.Router();
const Token = require("../models/Token");

// Save FCM token
router.post("/", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token required" });

    let exists = await Token.findOne({ token });
    if (!exists) {
      await Token.create({ token });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all tokens (for debugging)
router.get("/", async (req, res) => {
  try {
    const tokens = await Token.find().distinct("token");
    res.json({ success: true, tokens });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
