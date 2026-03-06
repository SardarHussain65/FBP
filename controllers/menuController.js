const MenuItem = require("../Models/MenuItem");
const { uploadFile: uploadToImageKit } = require('../services/storage.service');
const { successResponse, paginatedResponse } = require('../utils/response');

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
    return successResponse(res, 201, 'Menu item created successfully', newItem);
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

        return paginatedResponse(res, 200, 'Menu items retrieved successfully', menuItems, page, limit, total);
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
    return successResponse(res, 200, 'Menu item retrieved successfully', item);
};

const getMenuByTaste = async (req, res) => {
    const items = await MenuItem.find({ taste: req.params.taste });
    if (!items || items.length === 0) {
        const error = new Error('No menu items found for this taste');
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'Menu items retrieved successfully', items);
};

const updateMenuItem = async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'Menu item updated successfully', item);
};

const deleteMenuItem = async (req, res) => {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
        const error = new Error('Menu item not found');
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'Menu item deleted successfully', item);
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItem,
    getMenuByTaste,
    updateMenuItem,
    deleteMenuItem
};
