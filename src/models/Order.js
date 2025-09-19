const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: { type: String, required: true },
      price: Number,
      quantity: { type: Number, default: 1 },
    }
  ],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

