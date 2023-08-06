const express = require('express')
const router = express.Router()
const User = require("../models/users")

// TODO :  Get all users
router.get('/', async (req, res)=>{
    try {
        const users = await User.find()
        res.json(users)
    }catch (error){
        res.status(500).json({message : error.message})
    }

})

// TODO : get one user
router.get('/:id', getUser, (req, res)=>{
    res.json(res.user)
})


// TODO : create a user
router.post('/', async (req, res)=>{
    const user = new User({
        credentials : {
            userID : req.body.credentials.userID,
            password : req.body.credentials.password
        },
        data : {
            username : req.body.data.username,
            mail : req.body.data.mail
        }
    })

    try {
        const newuser = await user.save()
        res.status(201).json(newuser);
    }catch(error){
        res.status(400).json({message : error.message})
    }
})


// TODO : update a user
router.patch('/:id', getUser, async (req, res)=>{

    if (req.body.credentials != null) {
        if (req.body.credentials.userID != null) {
            res.user.credentials.userID = req.body.credentials.userID
        }
        if (req.body.credentials.password != null) {
            res.user.credentials.password = req.body.credentials.password
        }
    }
    if (req.body.data != null) {
        if (req.body.data.username != null) {
            res.user.data.username = req.body.data.username
        }
        if (req.body.data.mail != null) {
            res.user.data.mail = req.body.data.mail
        }
    }
    try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    }catch(error){
        res.status(400).json({message : error.message})
    }
})


// TODO : delete user
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
