const mongoose = require('mongoose')

const Users = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    wallet:{
        type:String,
        required:false
    },
    total:{
        type:String,
        required:false
    },

    paymentIntent:{
        type:String,
        required:false
    },

    coinbaseID:{
        type:String,
        required:false
    },

    jwt:{
        type:String,
        required:false
    }

})


module.exports = mongoose.model('Users',Users)