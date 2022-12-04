const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types
const userschema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/sohil/image/upload/v1599484962/default_pic_boplg1.png"
    },
    followers: [
        { type: ObjectId, ref: "User" }
    ],
    following: [
        { type: ObjectId, ref: "User" }
    ],
    resetToken: {
        type: String
    },
    expireToken: {
        type: Date
    }
})
mongoose.model("User", userschema)