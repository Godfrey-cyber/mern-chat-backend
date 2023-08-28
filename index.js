import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import WebSOcket, { WebSocketServer } from "ws"
import jwt from "jsonwebtoken"
import cors from "cors"
import User from "./models/User.js"
import Messages from "./models/Messages.js"
import userRoutes from "./routes/user.js"
import messageRoutes from "./routes/messages.js"

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

// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => app.listen(PORT, () => console.log(`Success 💯! Database running on port: ${PORT} 👍`))).catch(error => console.log(error))
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("disconnected", (error) => {
    console.log("MongoDatabase disconnected", error)
});


app.use('/', userRoutes)
app.use('/', messageRoutes)
// app.use('/', ) 

const server = app.listen(PORT, () => {
  console.log(`Success 💯! Database running on port: ${PORT} 👍`);
});
// establishing a webserver connection
const wss = new WebSocketServer({ server });
wss.on("connection", (connection, req) => {
	// const cookies = req.headers.cookie
	// if (cookies) {
	// 	const splitToken = cookies.split(';').find(str => str.startsWith("token="))
	// 	if (splitToken) {
	// 		const token = splitToken.split("=")[1]
	// 		if (token) {
	// 			jwt.verify(token, process.env.JWT_SECRET, {}, (error, data) => {
	// 				if (error) throw error
	// 				const { userId, username } = data
	// 				// console.log(data)
	// 				connection.userId = userId;
	// 				connection.username = username;
	// 			})
	// 		}
	// 	}
	// }

// send sigal about online users
	const signalAboutOnlineUsers = () => {
	    [...wss.clients].forEach((client) => {
		     client.send(
		        JSON.stringify({
		          	online: [...wss.clients].map((c) => ({
		            userId: c.userId,
		            username: c.username,
		          })),
		        })
		    );
	    });
  	}

  	connection.isAlive = true;

  // 	connection.timer = setInterval(() => {
	 //    connection.ping();
	 //    connection.deathTimer = setTimeout(() => {
		//     connection.isAlive = false;
		//     clearInterval();
		//     connection.terminate();
		//     signalAboutOnlineUsers();
		//     console.log('dead');
	 //    }, 1000);
	 // }, 5000)

  	connection.on('pong', () => {
    	clearTimeout(connection.deathTimer);
  	});

  	// Read the username and id from the cookie from this connection
  	const cookies = req.headers.cookie;
  	if (cookies) {
    	const tokenCookieString = cookies.split(';')
      .find((str) => str.startsWith('token='));
    	if (tokenCookieString) {
      		const token = tokenCookieString.split('=')[1];
      		if (token) {
	        		jwt.verify(token, process.env.JWT_SECRET, {}, (error, data) => {
	          		if (error) throw error;
	          		const { userId, username } = data;
	          		connection.userId = userId;
	          		connection.username = username;
	        	});
      		}
    	}
  	}

  	connection.on('message', async (message) => {
	    const { recipient, text } = JSON.parse(message.toString());
	    if (recipient && text) {
	      	const messageDoc = await Messages.create({
		        sender: connection.userId,
		        recipient,
		        text,
	      	});
		    [...wss.clients]
		    .filter((client) => client.userId === recipient)
		    .forEach((client) => client.send(JSON.stringify(messageDoc)));
	    }
  	});

	// Notify everyone about online people (when some one connects)
  	signalAboutOnlineUsers();
})
