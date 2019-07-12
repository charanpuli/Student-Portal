var LocalStrategy=require('passport-local').Strategy

var User = require('../model/Users2')
var mongoose=require('mongoose')
var bcrypt=require('bcryptjs')

module.exports=(passport)=>{

    passport.use(new LocalStrategy({
        usernameField:'email'
    },
    (email,password,done)=>{
        User.findOne({'email' : email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'user is not registered'})
                }
                bcrypt.compare(password,user.password,(error,ismatch)=>{
                    if(error) return error
                    if(!ismatch)
                        {
                            return done(null,false,{message:'password incorrect'})
                        }
                    return done(null,user)
                })
            })
            .catch(err=>console.log(err)
            )

    }))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
   
}