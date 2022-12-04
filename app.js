const express = require('express')
const app = express()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')
const cors = require('cors') 
app.use(express.json())
app.use(cors())
require('./models/user')
require("./models/post")
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
mongoose.connect(
    MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
mongoose.connection.on('connected', () => {
    console.log("Connected to mongoDB")
})
mongoose.connection.on('error', () => {
    console.log("err to mongoDB")
})
if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}
app.listen(PORT, () => {
    console.log("server is running on", PORT)
})













// //Video2
// // creating middlewares script
// const customMiddleware = (req, res, next) => {
//     console.log("middleware123 ")
//     next()
// }
// //this will run for all routes
// //app.use(customMiddleware)

// app.get('/', (req, res) => {
//     console.log("home")
//     res.send("hello world123")
// })

// app.get('/about', customMiddleware, (req, res) => {
//     console.log("about")
//     res.send("about world123")
// })