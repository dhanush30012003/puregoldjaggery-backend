const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

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
      items: items.map(i => ({
        product: i.product,
        price: i.price,
        quantity: i.quantity || 1
      })),
      totalAmount
    });

    await order.save();

    const msg = encodeURIComponent(
      `📦 New Order\n\n` +
      `👤 Name: ${customer.name}\n📞 Phone: ${customer.phone}\n🏠 Address: ${customer.address}, ${customer.city}, ${customer.pincode}\n\n` +
      `🛒 Items:\n${items.map(i => `${i.product} x${i.quantity || 1} = ₹${i.price * (i.quantity || 1)}`).join("\n")}\n\n` +
      `💰 Total: ₹${totalAmount}`
    );

    const whatsappURL = `https://wa.me/919482667559?text=${msg}`;

    res.json({ success: true, order, whatsapp: whatsappURL });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

