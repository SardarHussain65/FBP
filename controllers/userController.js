const User = require("../Models/Users");
const { generateToken } = require("../middleware/jwt");

const registerUser = async (req, res) => {
    const { username, password, name, email } = req.body;
    const newUser = new User({ username, password, name, email });
    await newUser.save();

    const payload = {
        id: newUser._id,
        username: newUser.username,
    }
    const token = generateToken(payload);
    res.status(201).json({ message: "User registered successfully", token });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (!user || !(await user.comparePassword(password))) {
        const error = new Error('Invalid username or password');
        error.statusCode = 401;
        throw error;
    }

    const payload = {
        id: user.id,
        username: user.username
    }
    const token = generateToken(payload);

    res.json({ token })
};

const getUserProfile = async (req, res) => {
    const userData = req.tokenPayload;
    const userId = userData.id;
    const user = await User.findById(userId).select('-password');
    res.status(200).json({ user });
};

const getAllUsers = async (req, res) => {
    const userDetail = await User.find();
    res.status(200).json(userDetail);
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers
};
