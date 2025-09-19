const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Token = require("../models/Token");
const { sendNotification } = require("../utils/notify");

// POST new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    const order = new Order({
      customerName: customer.name,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      phone: customer.phone,
      items: items.map((i) => ({
        product: i.product,
        price: i.price,
        quantity: i.quantity || 1,
      })),
      totalAmount,
    });

    const savedOrder = await order.save();

    // ✅ Notify admin(s)
    const tokens = await Token.find();
    if (tokens.length > 0) {
      for (const t of tokens) {
        await sendNotification(
          t.token,
          "🛒 New Order Received",
          `Customer: ${customer.name}, Amount: ₹${totalAmount}`,
          savedOrder._id.toString()
        );
      }
    }

    res.json({ success: true, order: savedOrder });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// GET all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single order (for admin modal)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
