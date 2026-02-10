require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./db')
const menuItemRoutes = require('./routes/menuItemRoutes')
const usersRoutes = require('./routes/usersRoutes')
app.use(bodyParser.json());
const { jwtAuthMiddleware } = require('./middleware/jwt');





app.get("/", (req, res) => {
    res.send("Hello World Testing");

});


app.use("/users", usersRoutes);

app.use("/menu", jwtAuthMiddleware, menuItemRoutes);



app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});