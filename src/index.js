const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes"));

// ✅ Health check
app.get("/", (req, res) => res.send("✅ API running"));

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


