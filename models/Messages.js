import mongoose from "mongoose"
import { Schema } from "mongoose"
import bcrypt from "bcryptjs"

const MessageSchema = new mongoose.Schema({
	sender:  { type: mongoose.Schema.Types.ObjectId, res: 'User' },
    recipient:  { type: mongoose.Schema.Types.ObjectId, res: 'User' },
	text: { type: String },
}, { timestamps: true })


export default mongoose.model("Message", MessageSchema)