const mongoose = require('mongoose')

const transactions = new mongoose.Schema({
    total:Number,

    source:String,

    date:Number,

    sourceId:String,
    
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'employee',
        required:false
    }

})


module.exports = mongoose.model('transactions', transactions)