const express = require('express')
const router = express.Router()
const Post = require('../models/posts')

router.get('/:id', getPost, async (req, res) => {
    try {
        res.json(res.post);
    }catch(error){
        res.status(400).json({message : error.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const _post = new Post({
            userID : req.body.userID,
            header : req.body.header,
            body : req.body.body,
            tags : req.body.tags,
            upvotes : req.body.upvotes,
            attachments : req.body.attachments
        })

        const post = await _post.save()
        res.status(201).json(post)
    }catch(error){
        res.status(400).json({message : error.message})
    }
})

router.patch('/:id', getPost, async (req, res) => {
    try{
        res.post.userID = req.body.userID || res.post.userID
        res.post.header = req.body.header || res.post.header
        res.post.body = req.body.body || res.post.body
        res.post.tags = req.body.tags || res.post.tags
        res.post.upvotes = req.body.upvotes || res.post.upvotes
        res.post.attachments = req.body.attachments || res.post.attachments

        const updatedPost = await res.post.save()
        res.json(updatedPost)

    }catch(error){
        res.status(400).json({message : error.message})
    }
})

router.delete('/:id', getPost, async (req, res) => {
    try {
        await res.post.deleteOne()
        res.json({message : "Post deleted successfully"})
    }catch(error) {
        res.status(500).json({message : error.message})
    }
})

/*
//delete all posts
router.delete('/', async (req, res)=>{
    try{
        const result = await Post.deleteMany({});
        res.json({ message: `${result.deletedCount} posts deleted successfully` });
    }catch(error){
        res.status(500).json({message : error.message})
    }
})
*/

async function getPost(req, res, next){
    try {
        let post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message : "Cannot find a post by given id"})
        }
        res.post = post
    }catch(error){
        return res.status(400).json({message : error.message})
    }
    next()
}


module.exports = router