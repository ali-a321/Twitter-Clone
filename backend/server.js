const express = require('express')
const dotenv = require('dotenv').config()
const color = require('colors')
const port = process.env.PORT || 5000
const cors = require('cors')
const {errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require('./config/db')

connectDB()
const app = express()

app.use(cors({
    origin:"http://localhost:3000",
}))
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

// Import routes
app.use("/twetter/home", require('./routes/homeRoutes'))
app.use("/twetter/users", require('./routes/userRoutes'))
app.use("/twetter/messages", require('./routes/messageRoutes'))
app.use("/twetter/conversations", require('./routes/conversationRoutes'))

app.use(errorHandler)

app.listen(port, ()=> console.log("Server Running"))
