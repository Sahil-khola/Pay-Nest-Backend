import User from "../model/user.model.js";
import Transaction from "../model/transation.model.js";
import bycrypt from "bcryptjs";

async function sendMoney(req, res) {
  const { phone, amount, mpin } = req.body;
  const senderId = req.user.id;


  if (!mpin) return res.status(400).send("Mpin is required");
  if (amount <= 0) return res.status(400).send("Amount must be greater than 0");
  if (!phone) return res.status(400).send("Phone number is required");
  try {
    const sender = await User.findById(senderId);
    if (!sender) return res.status(400).send("Sender not found");
    const isMatchedMpin = await bycrypt.compare(String(mpin), sender.mpin);
    if (!isMatchedMpin) return res.status(400).send("Invalid mpin");

    const receiver = await User.findOne({ phone });
    if (!receiver) return res.status(400).send("Receiver not found");

    if(sender.balance < amount) return res.status(400).send("Insufficient balance");
    if (sender.phone === receiver.phone) return res.status(400).send("You cannot send money to yourself");

    // transfer Logic
    sender.balance -= amount;
    receiver.balance += amount;
    await receiver.save();
    await sender.save();

    const transaction = await Transaction.create({
      senderId,
      receiverId: receiver._id,
      amount,
      billerName: "Paynest",
      types: "TRANSFER",
      status: "SUCCESS",
    });

    res.status(200).json({ message: "Money sent successfully", transaction });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function getTransactions(req, res) {
  const userId = req.user.id;
  try {
    const transaction = await Transaction.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "name phone email")
      .populate("receiverId", "name phone email");
    res.status(200).json({ message: "Transactions found", transaction });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export { sendMoney, getTransactions };




