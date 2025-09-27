const express = require("express");
const router = express.Router();
const Token = require("../models/Token");

// ✅ Save token to DB
router.post("/", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    // Avoid duplicates
    const savedToken = await Token.findOneAndUpdate(
      { token },
      { token },
      { upsert: true, new: true }
    );

    res.status(200).json(savedToken);
  } catch (err) {
    console.error("❌ Error saving token:", err);
    res.status(500).json({ error: "Failed to save token" });
  }
});

// ✅ Get all tokens (for testing)
router.get("/", async (req, res) => {
  const tokens = await Token.find();
  res.json(tokens);
});

module.exports = router;

