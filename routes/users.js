// definitions
const __SERVER_ERR = "Server Error while searching for user"
const __USER_NOT_FOUND = "User not found"
const __USER_FOUND = "User successfully found"

//requirements
const express = require('express')
const router = express.Router()
const User = require("../models/users")
const emailValidator = require('deep-email-validator')

// get one user
router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        const userID = req.query.userID;

        if (id) {
            let user = await User.findById(id)
            if (!user) 
                return res.status(404).json({ message: "Cannot find a user by given id" })
            res.json(user)
        } else if (userID) {
            let result = await userbyID(userID)
            if (!result.user)
                return res.status(404).json({ message: result.message })
            res.json(result.user)
        } else {
            const users = await User.find()
            res.json(users)
        }
    }catch(error){
        res.status(400).json({message : error.message})
    }
})

// create a user
router.post('/', async (req, res)=>{

    try {
        const validation = await emailValidator.validate(req.body.credentials.email);
        if (!validation.valid)
            return res.status(403).json({ message: "Email validation failed", validators: validation.validators, reason : validation.reason})
        
        const result = await userbyID(req.body.credentials.userID);
        if(result.user)
            return res.status(403).json({message : "UserID already exists"})
        
        const user = new User({
            credentials: {
                userID: req.body.credentials.userID,
                email: req.body.credentials.email,
                password: req.body.credentials.password
            },
            data: {
                username: req.body.data.username
            }
        })

        const newuser = await user.save()
        res.status(201).json(newuser);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// update a user
router.patch('/:id', getUser, async (req, res)=>{

    try{
        if (req.body.credentials != null) {
            if (req.body.credentials.userID != null) {
                res.user.credentials.userID = req.body.credentials.userID
            }
            if (req.body.credentials.email != null) {
                const validation = await emailValidator.validate(req.body.credentials.email);
                if (!validation.valid)
                    return res.status(403).json({ message: "Email validation failed", validationData: validation })
                res.user.credentials.email = req.body.credentials.email
            }
            if (req.body.credentials.password != null) {
                res.user.credentials.password = req.body.credentials.password
            }
        }
        if (req.body.data != null) {
            if (req.body.data.username != null) {
                res.user.data.username = req.body.data.username
            }
        }
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// delete user
router.delete('/:id', getUser, async (req, res)=>{
    try{
        await res.user.deleteOne()
        res.json({message : "User deleted successfully"})
    }catch(error){
        res.status(500).json({message : error.message})
    }
})

//delete all users
router.delete('/', async (req, res)=>{
    try{
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted successfully` });
    }catch(error){
        res.status(500).json({message : error.message})
    }
})

// helper functions
async function getUser(req, res, next){
    try {
        let user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message : "Cannot find a user by given id"})
        }
        res.user = user
    }catch(error){
        return res.status(400).json({message : error.message})
    }
    next()
}

async function userbyID(userID){
    try{
        let user = await User.findOne({"credentials.userID" : userID});
        return {message : !user?__USER_NOT_FOUND:__USER_FOUND, user : user};
    }catch(error){
        return {message : __SERVER_ERR, user : {}}
    }
}

module.exports = router
