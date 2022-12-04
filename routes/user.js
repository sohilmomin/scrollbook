const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name ")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    else {
                        res.json({ user, posts })
                    }
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not Found" })
        })
})

router.post('/search-users', (req, res) => {
    let userPattren = new RegExp("^" + req.body.query)
    User.find({ name: { $regex: userPattren } })
        .select("email name ")
        .then(user => {
            res.json({ user })
        })
        .catch(err => {
            console.log(err)
        })
})


router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                User.findByIdAndUpdate(req.user._id, {
                    $push: { following: req.body.followId }
                }, { new: true })
                    .select("-password")
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        return res.status(422).json({ error: err })
                    })
            }
        })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                User.findByIdAndUpdate(req.user._id, {
                    $pull: { following: req.body.unfollowId }
                }, { new: true })
                    .select("-password")
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        return res.status(422).json({ error: err })
                    })
            }
        })
})


router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.statur(422).json({ error: "Profile Photo cant updated" })
            }
            else {
                res.json(result)
            }
        })
})
module.exports = router