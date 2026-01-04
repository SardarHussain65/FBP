const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const menuItem = require('./Models/MenuItem')

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World Testing");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

app.post("/item", (req, res) => {
    const item = req.body;
    res.send(item);
});


app.post("/meuns", (req, res) => {

    const menuItem = new menuItem(res.data)


})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});