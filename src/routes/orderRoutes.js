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
    const tokens = await Token.find().distinct("token");
    if (tokens.length > 0) {
      await Promise.all(
        tokens.map((t) =>
          sendNotification(t, {
            title: "🛒 New Order Received",
            body: `Customer: ${customer.name}, Amount: ₹${totalAmount}`,
            data: { orderId: savedOrder._id.toString() }
          })
        )
      );
    }

    res.json({ success: true, order: savedOrder });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;
