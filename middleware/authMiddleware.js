// middleware to protect routes based in roles
const jwt = require("jsonwebtoken");

exports.protect = (req,res,next)=>{
    let token = req.header("Authorization");
    console.log("Received Token:", token);
    if(!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // Extract token
        } else {
            return res.status(401).json({ msg: "Invalid token format" });
        }

        console.log("Extracted Token:", token); // Log extracted token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        console.error("JWT Verification Error:", error);
        res.status(401).json({msg:"Token is not valid!"});
    }
};

// Middleware for admin-only routes
exports.adminOnly = (req,res,next)=>{
    if(req.user.role !== "admin") return res.status(403).json({msg:"Access denied!"});
    next();
};