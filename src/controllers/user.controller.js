import User from "../model/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
   const {name, email, password,phone} = req.body;
   const normalizedPhone = String(phone ?? "").trim();
   try {
   if (name,email,password,normalizedPhone) {
   const existuser = await User.findOne({$or: [{email}, {phone: normalizedPhone}]});
   if (existuser) {
      return res.status(409).json({message: "User already exist"})
   }
  
   const salt = await bycrypt.genSalt(10);
   const hashpassword = await bycrypt.hash(password, salt);

   // upi Id 
   const sanatizeName = email.toLowerCase();
   const upiId = `${sanatizeName.split("@")[0]}@paynest`;


   const user = await User.create({name, email, phone: normalizedPhone, password : hashpassword, upiId});
   const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
   if(user){
      res.status(201).json({message: "User created successfully", user, token});
   } else {
      res.status(400).json({message: "User not created"});
   }

} else {
   res.status(400).send("All fields are required")
}
   } catch (error) {
      res.status(500).send(error.message);
   }

};


const login = async (req, res) => {
   const {email , password} = req.body;
   try {
      if (email, password) {
         const user = await User.findOne({email});
         const isMatch = await bycrypt.compare(password, user.password);
         if (user && isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
            res.status(200).json({message: "Login successful", user, token});
         } else {
            res.status(400).send("Invalid email or password");
         }
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const getUserProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password -mpin");
      if (user) {
         res.status(200).json({message: "User found", user});
      } else {
         res.status(400).send("User not found");
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const setMpin = async (req, res) => {
   const {mpin} = req.body;
   try {
      if(!/^\d{4}$/.test(String(mpin))){
        return res.status(400).send("Mpin must be 4 digits");
      }
      const genSalt = await bycrypt.genSalt(10);
      const hashMpin = await bycrypt.hash(String(mpin), genSalt);
      const user = await User.findByIdAndUpdate(req.user.id, {mpin: hashMpin}, {new: true}).select("-password -mpin");
      if (user) {
         res.status(200).json({message: "Mpin set successfully"});
      } else {
         res.status(400).send("User not found");
      }
   } catch (error) { 
      res.status(400).send(error.message);
   }
};


export { signup, login, getUserProfile, setMpin };


