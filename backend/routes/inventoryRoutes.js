const express = require("express");
const Cart = require("../models/Cart");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");
const Inventory = require("../models/Inventory");
const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");
const Admin = require("../models/Admin");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const mongoose = require("mongoose");



router.post("/add", authMiddleware, async (req, res) => {
    const { image, price, description, itemName, quantity, category } = req.body;
    //medicine, equipment supplements

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        const newItem = new Inventory({
            image,
            itemName,
            stock: quantity,
            category,
            price,
        });

        await newItem.save();

        res.status(201).json({ message: "Item added to inventory successfully.", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});



router.get("/", async (req, res) => {
    try {
        const items = await Inventory.find();

        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});


router.patch("/update/:itemId", authMiddleware, async (req, res) => {
    const { itemName, image, quantity, category } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        const item = await Inventory.findById(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        if (itemName) item.itemName = itemName;
        if (quantity !== undefined) item.stock = quantity;
        if (category) item.category = category;
        if (image) item.image = image;

        await item.save();

        res.status(200).json({ message: "Item updated successfully.", item });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});


router.delete("/delete/:itemId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        const item = await Inventory.findByIdAndDelete(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        res.status(200).json({ message: "Item deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});




//! Cart Routes

router.post("/cart/add", authMiddleware, async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        // Validate itemId format
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid itemId format." });
        }

        // Fetch item details
        const item = await Inventory.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        // Check if there is enough stock available
        if (item.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock available." });
        }

        // Find user's cart
        const cart = await Cart.findOne({ user: req.user.id });

        // If the cart doesn't exist, create a new one
        if (!cart) {
            const newCart = new Cart({
                user: req.user.id,
                items: [{ itemId, quantity }],
            });

            // Calculate the total price when creating a new cart
            const itemDetails = await Inventory.findById(itemId);
            newCart.totalPrice = itemDetails.price * quantity;

            // Save the new cart
            await newCart.save();
            return res.status(201).json({ message: "Item added to cart.", cart: newCart });
        }

        // If the cart exists, check if the item is already in the cart
        const existingItem = cart.items.find((i) => i.itemId.toString() === itemId);

        if (existingItem) {
            // If the item exists, increase its quantity
            // Ensure the quantity is treated as a number
            existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
        } else {
            // If the item doesn't exist, add it to the cart
            cart.items.push({ itemId, quantity });
        }

        // Calculate the total price again
        let totalPrice = 0;
        for (const itemInCart of cart.items) {
            const itemDetails = await Inventory.findById(itemInCart.itemId);
            if (itemDetails) {
                totalPrice += itemDetails.price * itemInCart.quantity;
            }
        }

        cart.totalPrice = totalPrice;

        // Save the updated cart
        await cart.save();

        // Send the response with the updated cart
        res.status(200).json({ message: "Item added to cart.", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", error });
    }
});




router.get("/cart", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
        .populate("user", "name")
            .populate("items.itemId", "itemName price category"); // Corrected to populate itemId

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty." });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});


router.patch("/cart/remove", authMiddleware, async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Find the index of the item in the cart
        const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        const itemInCart = cart.items[itemIndex];

        // If no quantity is provided, or the quantity is the same or greater than what's in the cart, remove the item
        if (!quantity || quantity >= itemInCart.quantity) {
            cart.items.splice(itemIndex, 1);
        } else {
            // Otherwise, reduce the quantity
            itemInCart.quantity -= quantity;
        }


        let totalPrice = 0;
        for (const itemInCart of cart.items) {
            const itemDetails = await Inventory.findById(itemInCart.itemId);
            if (itemDetails) {
                totalPrice += itemDetails.price * itemInCart.quantity;
            }
        }

        cart.totalPrice = totalPrice;

        // Save the cart after making changes
        await cart.save();

        // Return a success message with the updated cart
        res.status(200).json({ message: "Item removed/quantity updated in cart.", cart });

    } catch (error) {
        res.status(500).json({ message: "Server error.", error, error });
    }
});

router.delete("/cart/clear", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).json({ message: "Cart cleared successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

module.exports = router;