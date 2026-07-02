import User from "../model/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
   const {name, email, password} = req.body;
   try {

   if (name,email,password) {
   const existuser = await User.findOne({email});
   if (existuser) {
      return res.status(400).json({message: "User already exist"})
   }
   const salt = await bycrypt.genSalt(10);
   const hashpassword = await bycrypt.hash(password, salt);
   const user = await User.create({name, email, password : hashpassword});
   res.status(201).json({message: "User created successfully", user});
} else {
   res.status(400).send("All fields are required")
}
   } catch (error) {
      res.status(400).send(error.message);
   }

};
const login = async (req, res) => {
   const {email , password} = req.body;
   try {
      if (email, password) {
         const user = await User.findOne({email});
         const isMatch = await bycrypt.compare(password, user.password);
         if (user && isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.status(200).json({message: "Login successful", user, token});
         } else {
            res.status(400).send("Invalid email or password");
         }
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};


const getAllUser = async (req, res) => {
   try {
      const users = await User.find();
      res.status(200).json({message: "All users", users});
   } catch (error) {
      res.status(400).send(error.message);
   }
}
export { signup, login, getAllUser };