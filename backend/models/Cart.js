const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
            quantity: { type: Number, required: true }, // How many items are added to the cart
        }
    ],
    totalPrice: { type: Number, default: 0 }, // Automatically calculate based on items
});

module.exports = mongoose.model("Cart", cartSchema);
