const express = require("express");
const router = express.Router();
const users = require("../Models/Users");


router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new users({ username, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/", async (req, res) => {
    try {
        const userDetail = await users.find();
        res.status(200).json(userDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;