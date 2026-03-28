const User = require("../Models/Users");
const { generateToken } = require("../middleware/jwt");
const { successResponse } = require('../utils/response');
const logger = require('../config/logger');

const registerUser = async (req, res) => {
    const { username, password, name, email } = req.body;
    const newUser = new User({ username, password, name, email });
    await newUser.save();

    logger.info(`New user registered: ${username} (${email})`);

    const payload = {
        id: newUser._id,
        username: newUser.username,
    }
    const token = generateToken(payload);
    return successResponse(res, 201, 'User registered successfully', { token, user: { id: newUser._id, username: newUser.username, email: newUser.email, name: newUser.name } });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Explicitly select password field since it's excluded by default
    const user = await User.findOne({ username: username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        logger.warn(`Failed login attempt for username: ${username}`);
        const error = new Error('Invalid username or password');
        error.statusCode = 401;
        throw error;
    }

    logger.info(`User logged in: ${username}`);

    const payload = {
        id: user.id,
        username: user.username
    }
    const token = generateToken(payload);

    return successResponse(res, 200, 'Login successful', { token, user: { id: user._id, username: user.username, email: user.email, name: user.name } });
};

const getUserProfile = async (req, res) => {
    const userData = req.tokenPayload;
    const userId = userData.id;
    const user = await User.findById(userId).select('-password');
    return successResponse(res, 200, 'User profile retrieved successfully', user);
};

const getAllUsers = async (req, res) => {
    const userDetail = await User.find().select('-password');
    return successResponse(res, 200, 'Users retrieved successfully', { count: userDetail.length, users: userDetail });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers
};
