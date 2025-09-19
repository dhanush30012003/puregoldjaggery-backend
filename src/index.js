const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ✅ Allowed Origins (Customer + Admin + Local Dev)
const allowedOrigins = [
  process.env.FRONTEND_URL,               // customer site
  process.env.ADMIN_URL,                  // admin app
  "http://localhost:3000",                // customer local
  "http://127.0.0.1:3000",
  "http://localhost:3001",                // admin local
  "http://127.0.0.1:3001"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
  })
);

app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes")); // NEW

// ✅ Root
app.get("/", (req, res) => {
  res.send("✅ PureGold Backend Running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
