const express = require('express')
const router = express.Router()
const User = require("../models/users")
const emailValidator = require('deep-email-validator')

// Get all users
router.get('/', async (req, res)=>{
    try {
        const users = await User.find()
        res.json(users)
    }catch (error){
        res.status(500).json({message : error.message})
    }

})

// get one user
router.get('/:id', getUser, (req, res)=>{
    res.json(res.user)
})


// TODO  : verify the email in create and update routes

// create a user
router.post('/register', async (req, res)=>{

    // return the userdata after validation
    try {
        const validation = await emailValidator.validate(req.body.credentials.email);

        if (!validation.valid)
            return res.status(403).json({ message: "Email validation failed", validationData: validation})

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
        const validation = await emailValidator.validate(req.body.credentials.email);

        if (!validation.valid)
            return res.status(403).json({ message: "Email validation failed", validationData: validation })
        if (req.body.credentials != null) {
            if (req.body.credentials.userID != null) {
                res.user.credentials.userID = req.body.credentials.userID
            }
            if (req.body.credentials.email != null) {
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

async function getUser(req, res, next){
    let user
    try {
        user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message : "Cannot find a user by given id"})
        }

    }catch(error){
        return res.status(400).json({message : error.message})
    }
    res.user = user
    next()
}

module.exports = router
