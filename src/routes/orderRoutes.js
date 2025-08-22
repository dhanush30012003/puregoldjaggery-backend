const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product"); // To fetch product names if needed

// POST new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Map items to schema format
    const mappedItems = items.map(i => ({
      productId: i.productId,
      quantity: i.qty
    }));

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

    // Optional: Generate WhatsApp message with product names
    const productDocs = await Product.find({ _id: { $in: mappedItems.map(i => i.productId) } });
    const msgItems = mappedItems.map(i => {
      const prod = productDocs.find(p => p._id.toString() === i.productId);
      return `${prod ? prod.name : i.productId} x${i.quantity}`;
    });

    const msg = encodeURIComponent(
      `📦 New Order\n\n` +
      `👤 Name: ${customer.name}\n📞 Phone: ${customer.phone}\n🏠 Address: ${customer.address}, ${customer.city}, ${customer.pincode}\n\n` +
      `🛒 Items:\n${msgItems.join("\n")}\n\n` +
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
    const orders = await Order.find().populate("items.productId", "name price image");
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;


