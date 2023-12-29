require("dotenv").config()
const express=require('express');
const mongoose=require('mongoose');
const passport=require('passport')
const bcrypt = require("bcrypt");
const session=require('express-session')
const passport_config=require('./passport-config')
const methodOverride=require('method-override')


//connecting to mongoose
// mongoose.connect("mongodb://127.0.0.1:27017/SoloWish")
const DATABASE_URL=process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL);
const User=require('./models/user')
const Post=require('./models/post')


const app=express();
app.use(methodOverride('_method'))
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use(express.static("public"))
app.use(passport.initialize());



//register

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

app.post('/register',async (req,res)=>
{
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    });
    user.save().then(()=>{
        console.log('user saved');
        res.redirect('/login')
    })
})


//login

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/login',
}))

//logout

app.get("/logout", function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  })

app.get('/home',async (req,res)=>{
    const post= await Post.find().sort({createdAt:'desc'})
    res.render('home',{post:post})
})

app.get('/new',(req,res)=>{
    res.render('new',{post: new Post()})
})

app.get('/edit/:id',async (req,res)=>{
    const post= await Post.findById(req.params.id)
    res.render('edit',{post:post})
})
app.get('/:id',async (req,res)=>{
   const post=await Post.findById(req.params.id);
   if(post==null)
   {
    res.redirect('/home');
   }
   res.render('show',{post:post})
})

app.post('/home',async (req,res,next)=>{
    req.post= new Post()
    next()
},saveArticleAndRedirect('new'))

app.put('/:id',async(req,res,next)=>{
    req.post=await Post.findById(req.params.id);
    next();
},saveArticleAndRedirect('edit'))

function saveArticleAndRedirect(path)
{
    return async (req,res)=>{
        let post=req.post
            post.title=req.body.title,
            post.description=req.body.description
        try{
           post= await post.save()
           res.redirect(`/home`)
        } catch(e){
            console.log(e);
            res.render(`${path}`,{post:post})
        }
    }
}
app.delete('/:id',async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/home')
})

const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running`);
})
