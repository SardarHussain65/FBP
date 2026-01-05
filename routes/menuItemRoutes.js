const express = require("express");
const router = express.Router();
const menuItem = require("../Models/MenuItem");

router.post("/", (req, res) => {
    const newItem = new menuItem(req.body);
    newItem.save()
        .then(() => {
            console.log("Menu item saved successfully");
        })
        .catch((error) => {
            console.error("Error saving menu item:", error);
        });
    res.send(newItem);
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