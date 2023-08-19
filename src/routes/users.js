// definitions
const __USER_NOT_FOUND = "User not found"
const __VALID_EMAIL = "Email verification succeeded"
const __INVALID_EMAIL = "Email verification failed"

//requirements
require('dotenv').config()
const express = require('express')
const OTP = require('otp-generator')
const nodemailer = require('nodemailer')

const router = express.Router()

const User = require("../models/users")
const Post = require("../models/posts")

const transporter = nodemailer.createTransport({
    service: 'gmail.com',
    auth: {
        user: process.env.SERVERMAIL,
        pass: process.env.SERVERPASS
    }
});

const generateOTP = () => {
  return OTP.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
};

// get one user
router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            let user = await User.findById(id)
            if (!user) 
                return res.status(404).json({ message: __USER_NOT_FOUND})
            res.json(user)
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
        const user = new User({
            credentials: {
                email: req.body.credentials.email,
                password: req.body.credentials.password
            },
            data: {
                username: req.body.data.username,
                postIDs : []
            }
        })

        const newuser = await user.save()
        res.status(201).json(newuser);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// otp verification
router.get('/otp/:email', (req, res)=>{
    try{
        const sendStatus = sendOTP(req.params.email);
        if(sendStatus.status)
            res.json({OTP : sendStatus.message})
        else
            res.status(400).json({message : sendStatus.message})
    }catch(error){
        res.status(500).json({message : error.message})
    }
})

// update a user
router.patch('/:id', getUser, async (req, res)=>{

    try{
        res.user.credentials.email = req.body.credentials.email || res.user.credentials.email 
        res.user.credentials.password = req.body.credentials.password || res.user.credentials.password
        res.user.data.username = req.body.data.username || res.user.data.username

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


// delete all users
router.delete('/', async (req, res)=>{
    try{
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted successfully` });
    }catch(error){
        res.status(500).json({message : error.message})
    }
})
/**/

//get posts of user
router.get('/:id/posts', async (req, res) => {

    try {
        let user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).json({ message: __USER_NOT_FOUND })
        
        if(req.query.id){
            if(user.data.postIDs.includes(req.query.id)){
                const post = Post.findById(req.query.id)
                return res.json(post)    
            }else{
                return res.status(404).json({message : "POST NOT FOUND FOR USER"})
            }
        }

        res.json({ postIDs: user.postIDs })
    } catch (error) {
        res.status(400).json({ message: error.message })
}
});

// create a new post
router.post('/:id/posts', getUser, async (req, res) => {
    try{
        const _post = new Post({
            userID : res.user._id,
            header : req.body.header,
            body : req.body.body,
            tags : req.body.tags,
            upvotes : req.body.upvotes,
            attachments : req.body.attachments
        })

        const post = await _post.save()
        res.user.data.postIDs.push(post._id)
        await res.user.save()
        res.status(201).json(post)
    }catch(error){
        res.status(400).json({message : error.message})
    }
})

//delete a user's post
router.delete('/:id/posts/:postID', getUser, async (req, res) => {
    try{
        let ind = res.user.data.postIDs.indexOf(req.params.postID)
        if(ind != -1){
            res.user.data.postIDs.splice(ind, 1)
        }else{
            return res.status(404).json({message : "User doesnot have a post by given id"})
        }
        const post = await Post.findById(req.params.postID)
        await post.deleteOne()
        res.json({message : "Post deleted successfully"})

    }catch(error){
        res.status(400).json({message : error.message})
    }
})

// helper functions
async function getUser(req, res, next){
    try {
        let user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message : __USER_NOT_FOUND})
        }
        res.user = user
    }catch(error){
        return res.status(400).json({message : error.message})
    }
    next()
}

function sendOTP(email) {
    
    const otp = generateOTP();
    const mailOptions = {
        from : process.env.SERVERMAIL,
        to : email,
        subject : 'OTP-Verfication for 4RUM',
        text :  `Your OTP for validation : ${otp}`
    }

    let msg =  {status : 1, message : otp}
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) 
            msg =  {status : 0, message : error}
    });
    return msg;
}

module.exports = router
