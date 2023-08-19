const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userID : {
        type : String,
        required : true
    },
    header : {
        type: String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    tags : [{
        type : String,
        required : true
    }],
    upvotes : {
        type : Number,
        required : true
    },
    attachments : [{
        type : String,
        required : false,
    }]
})

module.exports = mongoose.model('post', postSchema)