const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    uniquename : {
        type : String,
        required : true
    },
    filename : {
        type : String,
        required : true
    },
    size : {
        type : String,
        required : true
    },
    uploadedby : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('file', fileSchema)