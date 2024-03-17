const express = require("express");
const jwt = require("jsonwebtoken")
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config")
const zod = require("zod");
const authMiddleware = require("../middlewares/middleware")
const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const { username, password, firstName, lastName } = req.body

    const existingUser = await User.findOne({username})
    if (existingUser){
        return res.status(411).json({ // use return to stop the function from executing
            message: "Email already taken"
        })
    }

    const newUser = await User.create({username, password, firstName, lastName})

    const userId = newUser._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.status(201).json({
        message: "User created successfully",
        token: token
    })

})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const { username, password } = req.body
    const existingUser = await User.findOne({username, password})
    if (!existingUser){
        return res.status(411).json({
            message: "User not found"
        })
    }

    const userId = existingUser._id

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.status(201).json({
        message: "User signed in successfully",
        token: token
    })
})

const updateUserBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
}).partial()
// .partial() is used to make all the fields optional

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateUserBody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const userId = req.userId

    await User.updateOne({ _id: userId }, req.body)

    res.status(200).json({
        message: "User updated successfully"
    })
})

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || ""

    // send every user except the current user
    const currentUserId = req.userId
    // this query will return all the users except the current user
    const users = await User.find({
        $and: [{
            _id: {
                $ne: currentUserId
            }
        }, {
            $or: [{
                firstName: {
                    $regex: filter,
                    $options: "i"
                }
            }, {
                lastName: {
                    $regex: filter,
                    $options: "i"
                }
            }]
        }]
    })

    res.status(200).json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})



module.exports = router;