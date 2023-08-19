const Post = require('../models/posts')

const postController = {
    getPost : async (req, res)=>{
        try {
            let post = await Post.findById(req.params.id)
            if(!post)
                res.status(404).json({message : "Cannot find a post by given id"})
            res.json(post)
        }catch(error){
             res.status(400).json({message : error.message})
        }
    },
    createPost : async (req, res) => {
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
            res.status(201).json({id : post._id})
        }catch(error){
            res.status(400).json({message : error.message})
        }
    },
    updatePost : async (req, res) => {
        try{
            let post = await Post.findById(req.params.id)
            if(!post)
                res.status(404).json({message : "Cannot find a post by given id"})

            post.userID = req.body.userID || post.userID
            post.header = req.body.header || post.header
            post.body = req.body.body || post.body
            post.tags = req.body.tags || post.tags
            post.upvotes = req.body.upvotes ||post.upvotes
            post.attachments = req.body.attachments || post.attachments
    
            const updatedPost = await post.save()
            res.json({message : "Post Updated Successfully"})
    
        }catch(error){
            res.status(400).json({message : error.message})
        }
    },
    deletePost : async (req, res)=>{
        try {
            let post = await Post.findById(req.params.id)
            if(!post)
                res.status(404).json({message : "Cannot find a post by given id"})

            await post.deleteOne()
            res.json({message : "Post deleted successfully"})
        }catch(error) {
            res.status(500).json({message : error.message})
        }
    },
    deleteAll : async (req, res) => {
        try{
            const result = await Post.deleteMany({});
            res.json({ message: `${result.deletedCount} posts deleted successfully` });
        }catch(error){
            res.status(500).json({message : error.message})
        }
    }
}

module.exports = postController