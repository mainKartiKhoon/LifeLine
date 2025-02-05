const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(403).json({
            msg: "Authorization header is wrong"
        })
    }
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({
            msg: "There was some error authenticating from the middleware",
            error
        })
    }
}

module.exports = authMiddleware;