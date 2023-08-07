const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    credentials : {
        userID : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        }
    },
    data : {
        username : {
            type : String,
            required : true,
            default : '4rumUser69' 
        }
    }
})

module.exports = mongoose.model('user', userSchema);