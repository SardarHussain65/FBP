const { z } = require("zod");

const createMenu = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(1, "Price is required"), // Coerce string "10" to number 10
    // Image is handled by req.file, not req.body, so we don't validate it here or make it optional
    taste: z.string().min(1, "Taste is required"),
    isDrink: z.enum(["true", "false"]).transform(val => val === "true").or(z.boolean()).default(false),
    // ingredient can be a JSON string '["a","b"]' or a simple string 'a,b'
    ingredient: z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch (e) {
                return val.split(',').map(s => s.trim());
            }
        }
        return val;
    }, z.array(z.string())).default([]),
    num_of_sale: z.coerce.number().default(0),
});

const updateMenu = z.object({
    name: z.string().min(1, "Name is required").optional(),
    price: z.coerce.number().min(1, "Price is required").optional(),
    // Image is handled by req.file
    taste: z.string().min(1, "Taste is required").optional(),
    isDrink: z.enum(["true", "false"]).transform(val => val === "true").or(z.boolean()).default(false).optional(),
    ingredient: z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch (e) {
                return val.split(',').map(s => s.trim());
            }
        }
        return val;
    }, z.array(z.string())).default([]).optional(),
    num_of_sale: z.coerce.number().default(0).optional(),
});

module.exports = {
    createMenu,
    updateMenu
};