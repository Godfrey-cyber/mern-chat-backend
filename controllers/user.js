import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

// const generateToken = (id, username) => {
//     return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "1d"})
// }
// register user
export const register = async (req, res) => {
	const { username, password, email } = req.body
	try {
		if (!email || !username || !password) {
	        res.status(400)
	        throw new Error("Please enter all fiedls")
	    } 

	    if (password.length < 6) {
	        res.status(400)
	        throw new Error("Password must be more than 6 characters");
	    } 

	    const userExists = await User.findOne({ email })
	    if (userExists) {
	        res.status(400)
	        throw new Error("There exists a user registered with that email already")
	    } 

	    const registeredUser = await User.create({
	        username,
	        password,
	        email
	    });
	    // generateToken(registeredUser._id, username)
	    jwt.sign({ userId: registeredUser._id }, process.env.JWT_SECRET, {}, (err, token) => {
	    	if (err) throw new Error("No token found") 
    		    res.cookie('token', token).status(201).json({
    			_id: registeredUser._id
    		})
	    })
	    // return res.status(200).json({ data: registeredUser })
	} catch (error) {
		if (error) throw new Error("Something went wrong")
	}
	// return res.status(200).json({ data: registeredUser })
}