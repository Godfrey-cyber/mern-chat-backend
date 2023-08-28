import Messages from "../models/Messages.js"
import jwt from "jsonwebtoken"


const getUserData = async(req) => {
	return new Promise((resolve, reject) => {
		const { token } = req.cookies
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET, {}, (error, data) => {
				if (error) throw error
				resolve(data)
			})
		} else {
			rejeect("NO token")
		}
	})
}
export const messages = async(req, res) => {
	const { userId }  = req.params
	const userData = await getUserData(req)
	const myId = userData.userId

	const chats = await Messages.find({
		sender: { $in: [userId, myId] },
		recipient: { $in: [userId, myId] }
	}).sort({ createdAt: 1})
	res.status(200).json(chats)
}