const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.sendStatus(401)
    }
  
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user_id = decoded.user_id;
        req.user_email = decoded.email;
        req.user_role = decoded.role;
        console.log(decoded);
        next();
    });
};

module.exports = verifyJWT;
