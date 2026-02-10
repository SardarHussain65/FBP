const jwt = require("jsonwebtoken")


const jwtAuthMiddleware = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");
        return res.status(500).json({ error: "Internal server error" });
    }
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token Not Found" });
    }
    const token = authorization.split(" ")[1];
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
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
}


module.exports = {
    jwtAuthMiddleware,
    generateToken
}
