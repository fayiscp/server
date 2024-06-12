
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv').config()
app.use(express.json())
app.use(cors())


mongoose.connect(process.env.mongourl).then(() => {
    console.log('database are connected')
})

let userRouter = require("./routes/userRoute")
let productRouter = require("./routes/productRoute")


app.use('/user', userRouter)
app.use('/product', productRouter)

app.listen(5000, () => {
    console.log("port 5000 connected")
})