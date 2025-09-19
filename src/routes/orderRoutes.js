const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Token = require("../models/Token");
const { sendNotification } = require("../utils/notify");

// Create new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // ✅ Validate payload
    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // ✅ Save order in DB
    const newOrder = await Order.create({
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      items,
      totalAmount,
    });

    // ✅ Get all admin device tokens
    const tokens = await Token.find().distinct("token");

    if (tokens.length > 0) {
      await sendNotification(tokens, {
        title: "📦 New Order Received",
        body: `Customer: ${customer.name} | Total: ₹${totalAmount}`,
        data: { orderId: newOrder._id.toString() },
      });
    } else {
      console.log("⚠️ No FCM tokens registered yet.");
    }

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
