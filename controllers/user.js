import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

// const generateToken = (id, username) => {
//     return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "1d"})
// }
// register user
// const jwt_secret = process.env.JWT_SECRET
export const register = async (req, res) => {
	const { username, password, email } = req.body
	
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

    
    // generateToken(registeredUser._id, username)
    try {
    	const registeredUser = await User.create({ username, password, email });
	    jwt.sign({ userId: registeredUser._id, username: userExists.username }, process.env.JWT_SECRET, {}, (err, token) => {
	    	if (err) {
	    		console.log(err)
	    	} 
    		res.cookie('token', token, {
	            path: "/",
	            httpOnly: true,
	            expires: new Date(Date.now() + 1000 * 86400),
	            sameSite: "none",
	            secure: true
       		}).status(201).json({
    			_id: registeredUser._id,
    			username: userExists.username
    		})
	    })
	} catch (error) {
		if (error) {
			res.status(500).json("There was an error")
			console.log(error)
		}
	}
}

export const getUsers = async (req, res) => {
	try {
		const users = await User.find()
		if (!users) throw new Error("There are no users at the moment.")
		return res.status(200).json(users)
	} catch (error) {
		if (error) {
			res.status(401).json(error)
		}
	}
}

// get user profile 
export const userprofile = async (req, res) => {
	const {token} = req.cookies;
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, {}, (err, data) => {
    		if (err) {
    			console.log(err)
    		} 
			res.status(200).json(data)
			console.log(data)
    	})
    } else {
    	res.status(401).json("Token is invalid or does not exist!")
    }
}

export const login = async (req, res) => {
	const { password, email } = req.body
	try {
		if (!email || !password) {
	        res.status(400)
	        throw new Error("Please enter all fiedls")
	    } 

	    if (password.length < 6) {
	        res.status(400)
	        throw new Error("Password must be more than 6 characters");
	    } 

	    const userExists = await User.findOne({ email })
	    if (!userExists) {
	        res.status(400)
	        throw new Error("There is no user registered with that email")
	    } 

	    if (userExists) {
        	jwt.sign({ userId: userExists._id, username: userExists.username }, process.env.JWT_SECRET, {}, (err, token) => {
	    		if (err) {
	    			console.log(err)
	    		} 
    			res.cookie('token', token, {
		            path: "/",
		            httpOnly: true,
		            expires: new Date(Date.now() + 1000 * 86400),
		            sameSite: "none",
		            secure: true
       			}).status(201).json({
    				_id: userExists._id,
    				username: userExists.username
    			})
	    	})
	    } else {
	        res.status(400)
	        throw new Error("Invalid email or password!")
	    }
	    // generateToken(registeredUser._id, username)
	    
	    // return res.status(200).json({ data: registeredUser })
	} catch (error) {
		if (error) {
			console.log(error)
		}
	}
	// return res.status(200).json({ data: registeredUser })
}