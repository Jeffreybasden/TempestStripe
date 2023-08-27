const mongoose = require('mongoose')

const adminUser = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    
    jwt:{
        type:String,
        required:false
    }
})


module.exports = mongoose.model('adminUser',adminUser)