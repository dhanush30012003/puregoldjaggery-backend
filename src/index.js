const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "https://puregoldjaggery.web.app" }));

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

