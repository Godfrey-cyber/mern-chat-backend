import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { WebSocketServer } from "ws"
import jwt from "jsonwebtoken"
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

const server = mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => app.listen(PORT, () => console.log(`Success 💯! Database running on port: ${PORT} 👍`))).catch(error => console.log(error))

mongoose.connection.on("disconnected", (error) => {
    console.log("MongoDatabase disconnected", error)
});


app.use('/', userRoutes) 

// const wss = new ws.WebSocket.Server({server});
// wss.on("connection", (connection) => {
// 	console.lg("Connected :-D")
// })

// const wss = new ws({server})
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (connection, req) => {
	const cookies = req.headers.cookie
	if (cookies) {
		const splitToken = cookies.split(';').find(str => str.startsWith("token="))
		if (splitToken) {
			const token = splitToken.split("=")[1]
			if (token) {
				jwt.verify(token, process.env.JWT_SECRET, {}, (error, data) => {
					if (error) throw error
					const { userId, username } = data
				console.log(data)
					connection.userId = userId;
					connection.username = username;
				})
			}
		}
	}
[...wss.clients].forEach(client => {
	client.send(JSON.stringify	({
			online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username}))
		}))
	})	
})
// console.log(wss)