const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
})

const userModel=mongoose.model('info',userSchema)
module.exports=userModel