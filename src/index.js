// src/index.js (Backend)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { sendNotification } = require("./utils/pusher");
const admin = require("firebase-admin");

// Load environment variables
dotenv.config();

const app = express();

// ✅ Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Parse single-line JSON from Render .env
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin", err);
  }
}

// ✅ Allowed Origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://jaggeryadminapp.web.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
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

// ✅ Middleware
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes"));

// ✅ Root
app.get("/", (req, res) => res.send("✅ PureGold Backend Running..."));

// ✅ Test Notification
app.get("/api/test-notification", async (req, res) => {
  const Token = require("./models/Token");
  const tokens = await Token.find().distinct("token");

  if (tokens.length === 0) return res.send("⚠️ No tokens saved yet");

  await sendNotification(tokens, {
    title: "🔔 Test Notification",
    body: "This is a test from Render backend",
    data: { orderId: "test123" }
  });

  res.send("✅ Test notification sent");
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

