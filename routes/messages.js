import express from "express"
const router = express.Router()
import { messages } from "../controllers/messages.js"

router.get("/messages/:userId", messages)

export default router
