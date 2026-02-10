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
    try {
        // 1. Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2. Sorting
        let sortStr = 'createdAt';
        if (req.query.sort) {
            sortStr = req.query.sort.split(',').join(' ');
        }

        // 3. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // 4. Execution
        const menuItems = await MenuItem.find(queryObj)
            .sort(sortStr)
            .skip(skip)
            .limit(limit);

        // 5. Count for metadata
        const total = await MenuItem.countDocuments(queryObj);

        res.status(200).json({
            success: true,
            results: menuItems.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: menuItems
        });
    } catch (error) {
        // Fallback if something unexpected happens (though asyncHandler covers this usually)
        throw error;
    }
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
