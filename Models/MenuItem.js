const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    taste: {
        type: String,
        enum: ["sweet", "sour", "spicy"],
        required: true,
        index: true // Index for taste filtering
    },
    isDrink: {
        type: Boolean,
        default: false,
        required: true
    },
    ingredient: {
        type: [String],
        default: [],
        required: true
    },
    num_of_sale: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for faster queries
menuItemSchema.index({ name: 'text' }); // Text search on name
menuItemSchema.index({ taste: 1, price: 1 }); // Compound index for filtering
menuItemSchema.index({ num_of_sale: -1 }); // Index for sorting by popularity

const menuItem = mongoose.model("menuItem", menuItemSchema)

module.exports = menuItem; 