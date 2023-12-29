const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose')
const passport=require('passport')
const User=require('./models/user')
const bcrypt = require("bcrypt");

passport.use(new localStrategy({usernameField:'email'},(email,password,done)=>{
    const user=User.findOne({email:email}).then((user)=>{
        if(user==null)
        {
            return done(null,false,{message:'Wrong Credentials'});
        }
        const passwordMatch=bcrypt.compare(password,user.password);
        if(passwordMatch)
        {
            return done(null,user);
        }else{
            return done(null,false,{message:'Wrong Password'});
        }
    })
}));

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser((id,done)=>{
    const fetchUser=(id)=>User.findById(id);
    fetchUser(id).then((user)=>{
        return done(null,user);
    })
})