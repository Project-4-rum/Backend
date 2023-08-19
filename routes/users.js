// definitions
const __SERVER_ERR = "Server Error while searching for user"
const __USER_NOT_FOUND = "User not found"
const __USER_FOUND = "User successfully found"
const __VALID_EMAIL = "Email verification succeeded"
const __INVALID_EMAIL = "Email verification failed"

//requirements
const express = require('express')
const router = express.Router()
const User = require("../models/users")
const Post = require("../models/posts")
const emailValidator = require('deep-email-validator')

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

//get posts of user
router.get('/:id/posts', async (req, res) => {

    try {
        let user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).json({ message: __USER_NOT_FOUND })

        res.json({ postIDs: user.postIDs })
    } catch (error) {
        res.status(400).json({ message: error.message })
}
});

// create a user
router.post('/', async (req, res)=>{

    try { 
        const validation = await checkEmailExistence(req.body.credentials.email);
        if(!validation.verified)
            return res.status(403).json(validation.message);
        
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


// update a user
router.patch('/:id', getUser, async (req, res)=>{

    try{
        res.user.credentials.userID = req.body.credentials.userID || res.user.credentials.userID
        res.user.credentials.email = req.body.credentials.email || res.user.credentials.email
        res.user.credentials.password = req.body.credentials.password || res.user.credentials.password
        res.user.data.username = req.body.data.username || res.user.data.username

        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
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

// delete user
router.delete('/:id', getUser, async (req, res)=>{
    try{
        await res.user.deleteOne()
        res.json({message : "User deleted successfully"})
    }catch(error){
        res.status(500).json({message : error.message})
    }
})

/* delete all users
router.delete('/', async (req, res)=>{
    try{
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted successfully` });
    }catch(error){
        res.status(500).json({message : error.message})
    }
})
*/

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

async function checkEmailExistence(email) {
    const validation = await emailValidator.validate(email);
    return { verified : validation.valid, message: {message : (validation.valid?__VALID_EMAIL:__INVALID_EMAIL), validators: validation.validators, reason : validation.reason}}
}

module.exports = router
