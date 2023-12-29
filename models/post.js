const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    title:String,
    description:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const Post=mongoose.model('Post',postSchema)
module.exports=Post;