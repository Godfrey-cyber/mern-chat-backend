import express from "express"
const router = express.Router()
import { register, getUsers, userprofile, login } from "../controllers/user.js"

router.post("/register", register)
router.post("/login", login)
router.get("/users", getUsers)
router.get("/userprofile", userprofile)
// router.post("/login", login)
// router.post("/logout", logout)

export default router