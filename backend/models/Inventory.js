const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    image: {type: String, required: true},
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // E.g., Medicine, Equipment, Supplements
    stock: { type: Number, required: true }, // Number of items available
    description: { type: String }, // Optional details about the item
});

module.exports = mongoose.model("Inventory", inventorySchema);
