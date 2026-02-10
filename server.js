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





app.get("/", (req, res) => {
    res.send("Hello World Testing");

});


app.use("/users", usersRoutes);

app.use("/menu", jwtAuthMiddleware, menuItemRoutes);



app.use(passport.initialize());
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});