import express from "express"
const router = express.Router()
import { register, getUsers, userprofile, login, getUser } from "../controllers/user.js"

router.post("/register", register)
router.post("/login", login)
router.get("/users", getUsers)
router.get("/user/:id", getUser)
router.get("/userprofile", userprofile)
// router.post("/login", login)
// router.post("/logout", logout)

export default router

