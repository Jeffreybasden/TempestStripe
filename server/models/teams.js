const mongoose = require('mongoose')
const transaction = require('./transactions')

const Teams = new mongoose.Schema({

    teamName:{
        type:String,
        required:false
    },

    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee', // Reference to the transaction model
      },],

    transactions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions', // Reference to the transaction model
      },]

})


module.exports = mongoose.model('teams',Teams)