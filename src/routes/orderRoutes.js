// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const beamsClient = require("../utils/pusher"); // Pusher Beams client

// POST new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Create and save the order
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

    // ✅ Send Pusher Beams notification to all admin devices subscribed to "orders"
    await beamsClient.publishToInterests(["orders"], {
      web: {
        notification: {
          title: "🛒 New Order Received",
          body: `Customer: ${customer.name}, Amount: ₹${totalAmount}, Order ID: ${savedOrder._id}`,
          deep_link: "https://jaggeryadminapp.web.app", // Admin dashboard URL
        },
      },
    });

    res.json({
      success: true,
      order: savedOrder,
    });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// GET all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// GET single order (for admin modal)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Not found",
      });

    res.json(order);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
