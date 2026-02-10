const express = require("express");
const router = express.Router();
const menuItem = require("../Models/MenuItem");
const { uploadFile } = require('../middleware/multer');
const { uploadFile: uploadToImageKit } = require('../services/storage.service');



router.post("/", uploadFile, async (req, res) => {
    try {
        // 1. Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // 2. Upload to ImageKit
        const imageResult = await uploadToImageKit(req.file);

        // 3. Create new item with ImageKit URL
        const newItem = new menuItem({
            ...req.body,
            image: imageResult.url
        });

        // 4. Save to database
        newItem.save()
            .then(() => {
                console.log("Menu item saved successfully");
                res.status(201).send(newItem);  // ✅ Moved inside .then()
            })
            .catch((error) => {
                console.error("Error saving menu item:", error);
                res.status(500).json({ error: error.message });
            });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const menuItems = await menuItem.find()
        res.send(menuItems)
    } catch (error) {
        console.error("Error fetching menu items:", error)
    }
})


router.get("/:id", async (req, res) => {
    try {
        const item = await menuItem.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.send(item)
    } catch (error) {
        console.error("Error fetching menu item:", error)
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})

router.get("/taste/:taste", async (req, res) => {
    try {
        const item = await menuItem.find({ taste: req.params.taste })
        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.send(item)
    } catch (error) {
        console.error("Error fetching menu item:", error)
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})

router.put("/:id", async (req, res) => {
    try {
        const item = await menuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.send(item)
    } catch (error) {
        console.error("Error updating menu item:", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const item = await menuItem.findByIdAndDelete(req.params.id)
        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.send(item)
    } catch (error) {
        console.error("Error deleting menu item:", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;