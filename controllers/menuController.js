const MenuItem = require("../Models/MenuItem");
const { uploadFile: uploadToImageKit } = require('../services/storage.service');

const createMenuItem = async (req, res) => {
    // 1. Check if image was uploaded
    if (!req.file) {
        const error = new Error('Image is required');
        error.statusCode = 400;
        throw error;
    }

    // 2. Upload to ImageKit
    const imageResult = await uploadToImageKit(req.file);

    // 3. (Parsed by Zod Middleware now)

    // 4. Create new item with ImageKit URL and parsed data
    const newItem = new MenuItem({
        ...req.body,
        image: imageResult.url
    });

    // 4. Save to database
    await newItem.save();
    console.log("Menu item saved successfully");
    res.status(201).json(newItem);
};

const getAllMenuItems = async (req, res) => {
    const menuItems = await MenuItem.find();
    res.send(menuItems);
};

const getMenuItem = async (req, res) => {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    res.send(item);
};

const getMenuByTaste = async (req, res) => {
    const item = await MenuItem.find({ taste: req.params.taste });
    if (!item || item.length === 0) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    res.send(item);
};

const updateMenuItem = async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    res.send(item);
};

const deleteMenuItem = async (req, res) => {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    res.send(item);
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItem,
    getMenuByTaste,
    updateMenuItem,
    deleteMenuItem
};
