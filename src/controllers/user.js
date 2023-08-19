require('dotenv').config()
const OTP = require('otp-generator')
const nodemailer = require('nodemailer')

const User = require('../models/users')
const Post = require('../models/posts')

const _UNF = "User not found"
const _UUS = "User Updated Successfully"
const _UDS = "User Deleted Successfully"
const _PNFU = "POST NOT FOUND FOR USER"
const _PDS = "Post Deleted Successfully"

const transporter = nodemailer.createTransport({
    service: 'gmail.com',
    auth: {
        user: process.env.SERVERMAIL,
        pass: process.env.SERVERPASS
    }
})

const generateOTP = () => {
    return OTP.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
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


const userController = {
    getUser_s : async (req, res) => {
        try {
            const id = req.query.id;
            if (id) {
                let user = await User.findById(id)
                if (!user) 
                    return res.status(404).json({ message: _UNF})
                res.json(user)
            } else {
                const users = await User.find()
                res.json(users)
            }
        }catch(error){
            res.status(400).json({message : error.message})
        }
    },
    createUser : async (req, res) => {
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
            res.status(201).json({id : newuser._id});
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    verifyEmail : async (req, res)=>{
        try{
            const sendStatus = sendOTP(req.params.email);
            if(sendStatus.status)
                res.json({OTP : sendStatus.message})
            else
                res.status(400).json({message : sendStatus.message})
        }catch(error){
            res.status(500).json({message : error.message})
        }
    },
    updateUser : async (req, res)=>{
        try{
            let user = await User.findById(id)
            if (!user) 
                return res.status(404).json({ message: _UNF})

            user.credentials.email = req.body.credentials.email || user.credentials.email 
            user.credentials.password = req.body.credentials.password || user.credentials.password
            user.data.username = req.body.data.username || user.data.username

            const updatedUser = await res.user.save()
            res.json({message : _UUS})
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    deleteUser : async (req, res) => {
        try{
            let user = await User.findById(id)
            if (!user) 
                return res.status(404).json({ message: _UNF})

            await user.deleteOne()
            res.json({message : _UDS})
        }catch(error){
            res.status(500).json({message : error.message})
        }
    },
    deleteAll : async (req, res) => {
        try{
            const result = await User.deleteMany({});
            res.json({ message: `${result.deletedCount} users deleted successfully` });
        }catch(error){
            res.status(500).json({message : error.message})
        }
    },
    getPost_s : async (req, res) => {
        try {
            let user = await User.findById(req.params.id)
            if (!user)
                return res.status(404).json({ message: _UNF })
            
            if(req.query.id){
                if(user.data.postIDs.includes(req.query.id)){
                    const post = Post.findById(req.query.id)
                    return res.json(post)    
                }else{
                    return res.status(404).json({message : _PNFU})
                }
            }
    
            res.json({ postIDs: user.postIDs })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    createPost : async (req, res) => {
        try{
            let user = await User.findById(req.params.id)
            if (!user)
                return res.status(404).json({ message: _UNF })
            
            const _post = new Post({
                userID : user._id,
                header : req.body.header,
                body : req.body.body,
                tags : req.body.tags,
                upvotes : req.body.upvotes,
                attachments : req.body.attachments
            })
    
            const post = await _post.save()
            user.data.postIDs.push(post._id)
            await user.save()
            res.status(201).json({id : post._id})
        }catch(error){
            res.status(400).json({message : error.message})
        }
    },
    deletePost : async (req, res) => {
        try{
            let user = await User.findById(req.params.id)
            if (!user)
                return res.status(404).json({ message: _UNF })

            let ind = user.data.postIDs.indexOf(req.params.postID)
            if(ind != -1){
                user.data.postIDs.splice(ind, 1)
            }else{
                return res.status(404).json({message : _PNFU})
            }
            const post = await Post.findById(req.params.postID)
            await post.deleteOne()
            await user.save()
            res.json({message : _PDS})
        }catch(error){
            res.status(400).json({message : error.message})
        }
    }
}


module.exports = userController