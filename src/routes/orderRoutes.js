const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/Order");

// POST new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Convert productId to ObjectId and map qty
    const mappedItems = items.map(i => {
      if(!mongoose.Types.ObjectId.isValid(i.productId)){
        throw new Error("Invalid productId: " + i.productId);
      }
      return {
        productId: mongoose.Types.ObjectId(i.productId),
        quantity: i.qty
      };
    });

    const order = new Order({
      customerName: customer.name,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      phone: customer.phone,
      items: mappedItems,
      totalAmount
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId", "name price image");
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;



