import User from "../model/user.model.js";
import Transaction from "../model/transation.model.js";
import bycrypt from "bcryptjs";
async function addMoney(req,res) {
    const {amount , mpin} = req.body;
    const userId = req.user.id;
    if (!amount,!mpin) {
        return res.status(400).json( {meesage:"All fields are required"});
    }
    const user = await User.findById(userId);
    if(!user) return res.status(400).json({message:"User not found"});

    const isMatchedMpin = await bycrypt.compare(String(mpin), user.mpin);
    if(!isMatchedMpin) return res.status(400).json({message:"Invalid mpin"});

    // add money logic
    user.balance += amount;
    await user.save();
    
    const transaction = await Transaction.create({senderId: userId, receiverId: userId, amount: amount, types: "ADD_MONEY", status: "SUCCESS", billerName :'self'});
    res.status(200).json({message:"Money added successfully", transaction});
}

async function payBills(req,res) {
    try {
        const {billerName , amount , mpin} = req.body;
        const userId = req.user.id;
        if(!amount,!mpin) {
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message:"User not found"});
        const isMatchedMpin = await bycrypt.compare(String(mpin), user.mpin);
        if(!isMatchedMpin) return res.status(400).json({message:"Invalid mpin"});

        if(amount <= 0) return res.status(400).json({message:"Amount must be greater than 0"});
        if(user.balance < amount) return res.status(400).json({message:"Insufficient balance"});
 

        // transfer logic
        user.balance -= amount;
        await user.save();
        const transaction = await Transaction.create({senderId: userId, receiverId: userId, amount: amount, types: "BILL_PAYMENT", status: "SUCCESS", billerName});
        res.status(200).json({message:"Bill paid successfully", transaction});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

export {addMoney,payBills};