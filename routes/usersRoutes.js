const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwt");
const validate = require('../middleware/validate');
const { register, login } = require('../validations/user.validation');
const asyncHandler = require('../utils/asyncHandler');
const userController = require('../controllers/userController');


router.post("/register", validate(register), asyncHandler(userController.registerUser));


router.post('/login', validate(login), asyncHandler(userController.loginUser));

// Profile route
router.get('/profile', jwtAuthMiddleware, asyncHandler(userController.getUserProfile));


router.get("/", jwtAuthMiddleware, asyncHandler(userController.getAllUsers));

module.exports = router;