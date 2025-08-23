const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middlewares
const allowed = process.env.FRONTEND_URL || "http://localhost:8080";
app.use(cors({ origin: allowed }));
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Root
app.get("/", (req, res) => {
  res.send("✅ PureGold Backend Running...");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


