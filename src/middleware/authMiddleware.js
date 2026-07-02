import jwt from "jsonwebtoken";
import User from "../model/user.model.js";


const protect = async (req,res,next)=>{
     const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(token){
        try {
            const verfied = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(verfied.id).select("-password");
            if (!req.user) {
                return res.status(401).json({message:"Not authorized"});
            }
            next();
        } catch (error) {
            res.status(401).json({message:"Not authorized",error:error.message});
        }
    } else{
        res.status(401).json({message:"No token found"});
    }
}

export {protect};
