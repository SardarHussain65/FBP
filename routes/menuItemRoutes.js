const express = require("express");
const router = express.Router();
const { uploadFile } = require('../middleware/multer');
const validate = require('../middleware/validate');
const { createMenu, updateMenu } = require('../validations/menu.validation');
const asyncHandler = require('../utils/asyncHandler');
const menuController = require('../controllers/menuController');

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu item management endpoints
 */

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - taste
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spicy Chicken Burger
 *               price:
 *                 type: number
 *                 example: 12.99
 *               taste:
 *                 type: string
 *                 enum: [sweet, sour, spicy]
 *                 example: spicy
 *               isDrink:
 *                 type: boolean
 *                 example: false
 *               ingredient:
 *                 type: string
 *                 description: Comma-separated ingredients or JSON array
 *                 example: 'chicken,bun,lettuce'
 *               num_of_sale:
 *                 type: integer
 *                 example: 0
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, png, etc.)
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Validation error or missing image
 *       401:
 *         description: Unauthorized
 */
router.post("/", uploadFile, validate(createMenu), asyncHandler(menuController.createMenuItem));

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items with pagination and filtering
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *         description: Sort field (prefix with - for descending)
 *       - in: query
 *         name: taste
 *         schema:
 *           type: string
 *           enum: [sweet, sour, spicy]
 *         description: Filter by taste
 *       - in: query
 *         name: isDrink
 *         schema:
 *           type: boolean
 *         description: Filter by drink status
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/", asyncHandler(menuController.getAllMenuItems));

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", asyncHandler(menuController.getMenuItem));

/**
 * @swagger
 * /menu/taste/{taste}:
 *   get:
 *     summary: Get menu items by taste
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taste
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sweet, sour, spicy]
 *         description: Taste category
 *     responses:
 *       200:
 *         description: List of menu items with specified taste
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: No menu items found for this taste
 *       401:
 *         description: Unauthorized
 */
router.get("/taste/:taste", asyncHandler(menuController.getMenuByTaste));

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               taste:
 *                 type: string
 *                 enum: [sweet, sour, spicy]
 *               isDrink:
 *                 type: boolean
 *               ingredient:
 *                 type: string
 *               num_of_sale:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", uploadFile, validate(updateMenu), asyncHandler(menuController.updateMenuItem));

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", asyncHandler(menuController.deleteMenuItem));

module.exports = router;