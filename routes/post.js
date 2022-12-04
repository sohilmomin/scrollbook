const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
router.post("/createpost", requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please provide details" })
    }
    else {
        req.password = undefined
        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user
        })
        post.save().then(result => {
            if (result) {
                res.json({ post: result })
            }
        })
            .catch(err => {
                console.log(err)
            })
    }
})

router.get("/allPost", requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            if (posts) {
                res.json({ posts })
            }
        })
        .catch(err => {
            console.log(err)
        })
})



router.get("/subscribedPost", requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            if (posts) {
                res.json({ posts })
            }
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/mypost", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name pic")
        .then(mypost => {
            if (!mypost) {
                console.log("cant get posts")
                return res.status(422).json({ error: "cant get posts" })
            }
            else {
                res.json({ mypost: mypost })
            }
        })
        .catch(err => {
            res.status(422).json({ err: "Error finding posts" })
        })
})


router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, { new: true })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, { new: true })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, { new: true })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })

})
module.exports = router