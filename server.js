require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./db')
const menuItemRoutes = require('./routes/menuItemRoutes')
const usersRoutes = require('./routes/usersRoutes')
app.use(bodyParser.json());
const passport = require('./auth');
const { jwtAuthMiddleware } = require('./Models/jwt');
const { uploadFile: uploadToImageKit } = require('./services/storage.service');


const { uploadFile } = require("./middleware/multer");

app.post("/upload", uploadFile, async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await uploadToImageKit(file);
        console.log("File uploaded successfully:", result);

        res.status(200).json({
            message: "File uploaded successfully",
            file: result
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message });
    }
});




app.get("/", (req, res) => {
    res.send("Hello World Testing");

});


app.use("/users", usersRoutes);

app.use("/menu", jwtAuthMiddleware, menuItemRoutes);



app.use(passport.initialize());
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});