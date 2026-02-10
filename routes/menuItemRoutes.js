const express = require("express");
const router = express.Router();
const { uploadFile } = require('../middleware/multer');
const validate = require('../middleware/validate');
const { createMenu, updateMenu } = require('../validations/menu.validation');
const asyncHandler = require('../utils/asyncHandler');
const menuController = require('../controllers/menuController');



router.post("/", uploadFile, validate(createMenu), asyncHandler(menuController.createMenuItem));

router.get("/", asyncHandler(menuController.getAllMenuItems));


router.get("/:id", asyncHandler(menuController.getMenuItem));

router.get("/taste/:taste", asyncHandler(menuController.getMenuByTaste));

router.put("/:id", uploadFile, validate(updateMenu), asyncHandler(menuController.updateMenuItem));

router.delete("/:id", asyncHandler(menuController.deleteMenuItem));

module.exports = router;