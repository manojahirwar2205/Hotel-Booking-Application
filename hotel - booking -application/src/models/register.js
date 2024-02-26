const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const Schema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     token:{
        type:String,
        required:true
     }
   

})


const Collection= new mongoose.model("AuthCollection", Schema)

module.exports=Collection;