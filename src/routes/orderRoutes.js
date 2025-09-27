const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { sendNotification } = require("../utils/notify"); // 👈 make sure you have this

// ✅ Create order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // 🔔 Send push notification to all saved tokens
    try {
      await sendNotification("New Order", `Order from ${order.customerName} - ₹${order.totalAmount}`);
    } catch (notifyErr) {
      console.error("⚠️ Notification failed:", notifyErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Get all orders (for Admin app)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;


