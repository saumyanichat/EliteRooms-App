const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Error in auth middleware:",error);
        res.status(401).json({error:"Unauthorized"});
    }
}