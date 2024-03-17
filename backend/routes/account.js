const express = require('express');
const { Account, User } = require('../db');
const authMiddleware = require('../middlewares/middleware');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {

    //find user account which contains balance
    const account = await Account.findOne({
        userId: req.userId
    })

    //find user details
    const userAccount = await User.findOne({ _id: req.userId });

    res.json({
        balance: account.balance,
        firstName: userAccount.firstName,
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const session = await mongoose.startSession();

        session.startTransaction();
        const { to, amount } = req.body;

        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        };

        const toAccount = await Account.findOne({userId: to}).session(session)

        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        };

        // Perform the transfer
        await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount} } ).session(session)
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        });
    }


});

module.exports = router;