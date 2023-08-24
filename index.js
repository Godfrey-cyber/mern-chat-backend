import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoutes from "./routes/user.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true
}))

// connection to the mongodb
const MONGO_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 8080

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => app.listen(PORT, () => console.log(`Success! Database running on port: ${PORT}`))).catch(error => console.log(error))

mongoose.connection.on("disconnected", () => {
    console.log("MongoDatabase disconnected")
})


app.use('/', userRoutes) 

// app.listen(process.env.PORT)

