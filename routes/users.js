var express=require('express')
var router=express.Router()
var path=require('path')
var User=require('../model/Users2')
var bcrypt=require('bcryptjs')
var passport=require('passport')

router.get('/login',(req,res)=>{
    res.render('login',{
        id :'login'
    })
})
router.get('/signup',(req,res)=>{
    res.render('signup',{
        id:'signup'

    })
})

router.use(express.static(path.join(__dirname,'../public')))




//signup route
router.post('/signup',(req,res)=>{
    var errors=[]
    
    var {name,email,number,year,branch,sem,password,password2,check} =req.body
    
    var branches=["cse","CSE","ece","ECE","IT","it","ICT","ict","eee","EEE","ME","CE","Bio.tech","mech","civil"]
    

    if(!name || !email || !number || !year || !branch ||!sem || !password || !password2){

        errors.push({msg:'Enter all the details...'})
    }
    
    else if(password != password2){
        errors.push({msg:'Password incorrect...'})
    }
    else if(password.length <6){
        errors.push({msg:'Password should contain atleast 6 characters...'})
    }
    else if(!check){
        errors.push({msg:"Agree the terms..."})
    }
    else if(sem <0 || sem>8){
        errors.push({msg:'enter valid semester no.'})
    }
    else if(!branches.includes(branch)){
        errors.push({msg:'enter valid branch name...'})
    }
    
    else{
        
        
        
        User.findOne({'email' : email})
            .then(user=>{
                if(user){
                    errors.push({msg :'Email already registered...'})
                    res.render('signup',{
                        id : 'signup',
                        errors,name,email,number,year,branch,sem,password,password2,check
                    })
                }
                else{
                   var newuser=new User({
                    name,email,number,year,branch,sem,password
                   })
                   bcrypt.genSalt(10,(error,salt)=>{
                    bcrypt.hash(newuser.password,salt,(error,hash)=>{
                        if(error)
                        throw error

                        newuser.password=hash

                        newuser.save()
                        .then(user=>
                            
                            {req.flash('success_msg',"Registered successfully and can log in");
                            res.redirect('/users/login');})
                        .catch(err=>console.log(err)
                        )
                    })
                })
                    
                }
            })
            .catch(err=>console.log(err)
            )
    }
    if(errors.length>0){
        
        res.render('signup',{
            id : 'signup',
            errors,name,email,number,year,branch,sem,password,password2,check
        })
    }





})



//login route
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
        
    })(req,res,next)
})
// router.post('/login',(req,res)=>{
//     console.log(req.body);
    
// })





module.exports=router