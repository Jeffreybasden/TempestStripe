const mongoose = require('mongoose')
const transaction = require('./transactions')
const employee = new mongoose.Schema({

    employeeName:{
        type:String,
        required:false
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"teams"
    },

    sales:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions', // Reference to the transaction model
      },]

})


module.exports = mongoose.model('employee',employee)