const { z } = require("zod");

const createMenu = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(1, "Price is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    image: z.string().min(1, "Image is required"),
    taste: z.string().min(1, "Taste is required"),
    isDrink: z.boolean().default(false),
    ingredient: z.array(z.string()).default([]),
    num_of_sale: z.number().default(0),
});

const updateMenu = z.object({
    name: z.string().min(1, "Name is required").optional(),
    price: z.number().min(1, "Price is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    image: z.string().min(1, "Image is required").optional(),
    taste: z.string().min(1, "Taste is required").optional(),
    isDrink: z.boolean().default(false).optional(),
    ingredient: z.array(z.string()).default([]).optional(),
    num_of_sale: z.number().default(0).optional(),
});

module.exports = {
    createMenu,
    updateMenu
};