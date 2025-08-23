const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: { type: String, required: true },
      price: Number,
      quantity: { type: Number, default: 1 },
    }
  ],
  totalAmount: Number,
  customerName: String,
  address: String,
  city: String,
  pincode: String,
  phone: String,
  status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
