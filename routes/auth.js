const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL } = require('../config/keys')

const tranporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {

        return res.status(422).json({ error: "Please add all the  fields" })
    }
    else {
        User.findOne({ $or: [{ email: email }, { name: name }] })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "User with same name or email already exist" })
                }
                else {
                    bcrypt.hash(password, 12)
                        .then((hasedpassword => {
                            const user = new User({ name, email, password: hasedpassword, pic: pic })
                            user.save()
                                .then((user) => {
                                    tranporter.sendMail({
                                        to: user.email,
                                        from: "201701227@daiict.ac.in",
                                        subject: "signup  Success",
                                        html: "<h1>Welcome To InstaClone</h1>"
                                    })
                                    res.json({ message: "Signed Up Successfully." })
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }))

                }
            })
            .catch(err => {
                console.log("error to find such User")
                console.log(err)
            })
    }
})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provied email or password" })
    }
    else {
        User.findOne({ email: email })
            .then((saveduser) => {
                if (!saveduser) {
                    return res.status(422).json({ error: "Invalid Email or password" })
                }
                else {
                    bcrypt.compare(password, saveduser.password)
                        .then(doMatch => {
                            if (doMatch) {
                                const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET)
                                const { _id, name, email, followers, following, pic } = saveduser
                                res.json({ token, user: { _id, name, email, followers, following, pic } })
                                //res.json({ message: "successfully signed in" })

                            }
                            else {
                                return res.status(422).json({ error: "Invalid Email or password" })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
    }
})


router.post("/resetpassword", (req, res) => {
    crypto.randomBytes(32, (err, Buffer) => {
        if (err) {
            console.log(err)
        }
        else {
            const token = Buffer.toString("hex")
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: "Email not exist" })
                    }
                    else {
                        user.resetToken = token,
                            user.expireToken = Date.now() + 3600000
                        user.save().then((result) => {
                            tranporter.sendMail({
                                to: user.email,
                                from: "201701227@daiict.ac.in",
                                subject: "Password reset",
                                html: `
                                <p>You requested for password Reset</p>
                                <h6>Click on this <a href="${EMAIL}/reset/${token}" >link</a> to reset password</h6>
                            `
                            })
                            res.json({ message: "Check Your Email" })
                        })
                    }
                })
        }
    })
})

router.post('/newpassword', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                res.status(404).json({ error: "Try Again. Session Expired" })
            }
            else {
                bcrypt.hash(newPassword, 12).then(hasedpassword => {
                    user.password = hasedpassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then((savedUser) => {
                        res.json({ message: "password Updated." })
                    })
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
})
module.exports = router