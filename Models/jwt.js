const jwt = require("jsonwebtoken")


const jwtAuthMiddleware = (req, res, next) => {

    const autherization = req.headers.authorization;

    if (!autherization) {
        return res.status(401).json({ message: "Token Not Found" });
    }

    const token = autherization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tokenPayload = decoded
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }

}


const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
}


module.exports = {
    jwtAuthMiddleware,
    generateToken
}
