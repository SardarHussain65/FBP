const express = require("express");
const router = express.Router();
const users = require("../Models/Users");
const { jwtAuthMiddleware, generateToken } = require("../Models/jwt");


router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        const newUser = new users(data);
        await newUser.save();
        const payload = {
            id: newUser._id,
            username: newUser.username,
        }
        const token = generateToken(payload);
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await users.findOne({ username: username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.tokenPayload;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await users.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.get("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const userDetail = await users.find();
        res.status(200).json(userDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;