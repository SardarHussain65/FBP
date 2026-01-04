const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    taste: {
        type: String,
        enum: ["sweet", "sour", "spicy"],
        required: true
    },
    isDrink: {
        type: Boolean,
        default: false,
        required: true
    },
    ingredient: {
        type: [string],
        default: [],
        required: true
    },
    num_of_sale: {
        type: Number,
        default: 0,
        required: true
    }
})

const menuItem = mongoose.model("menuItem", menuItemSchema)

module.export = menuItem; 