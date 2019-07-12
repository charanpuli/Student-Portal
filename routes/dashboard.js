var express=require('express')

var router=express.Router()
var path=require('path')
var bcrypt=require('bcryptjs')
var {ensureAuthenticated}=require('../config/auth')
var passport=require('passport')


var User=require('../model/Users2')
router.use('/',express.static(path.join(__dirname,'../public')))

// router.get('/',ensureAuthenticated,(req,res)=>
//     res.sendFile(path.join(__dirname,'../public/menux.html'))
// )
router.get('/',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        id:'Dashboard',
        name:req.user.name
    })
})
router.get('/services',ensureAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/services.html'))
})
router.get('/notice',ensureAuthenticated,(req,res)=>{
    res.render('notify',
    {id:'notice'})
})

router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logOut()
    req.flash("success_msg","Logged Out Successfully...")
    res.redirect('/users/login')
})

//profile

router.get('/profile',ensureAuthenticated,(req,res)=>{
    var errors=[]
    User.findOne({'email':req.user.email})
        .then(
            user=>{
                var name=user.name
                var email=user.email
                var number=user.number
                var year=user.year
                var branch=user.branch
                var sem=user.sem
                
                
                res.render('profile',{
                    name,email,number,year,branch,sem,id:'profile'
                })
                
            }
            
        ).catch(err=>console.log(err)
        )

})
router.post('/profile',  function(req, res){
    errors=[]
    User.findOne({ 'email': req.user.email}, (err, user)=>{
        if(!user){
            req.flash('error', 'No account found');

            
            return res.redirect('/dashboard/profile/');
            
        }
        
        
    //    var {usernameEdit,emailEdit,numberEdit,yearEdit,branchEdit,semEdit,passwordEdit,password2Edit,check,save}=req.body
       var usernameEdit=req.body.name
       var emailEdit=req.body.email
       var numberEdit=req.body.number
       var semEdit=req.body.sem
       var yearEdit=req.body.year
       var branchEdit=req.body.branch
       var passwordEdit=req.body.password
       var password2Edit=req.body.password2
       var check=req.body.check
         var branches=["cse","CSE","ece","ECE","IT","it","ICT","ict","eee","EEE","ME","CE","Bio.tech","mech","civil"]

        // if(!usernameEdit || !emailEdit || !numberEdit || !yearEdit || !branchEdit ||!semEdit || !passwordEdit || !password2Edit){
        if(!usernameEdit || !emailEdit || !numberEdit || !yearEdit || !branchEdit ||!semEdit || !passwordEdit || !password2Edit){

                            // errors.push({msg:'Enter all the details...'})
                            req.flash('error_msg','enter all the details...')
                            res.redirect('/dashboard/profile')
                        }
                        
                        else if(passwordEdit != password2Edit){
                            // errors.push({msg:'Password incorrect...'})
                            req.flash('error_msg','repeat password...')
                            res.redirect('/dashboard/profile')
                        }
                        else if(passwordEdit.length <6){
                            // errors.push({msg:'Password should contain atleast 6 characters...'})
                            req.flash('error_msg','minimum password length should be 6...')
                            res.redirect('/dashboard/profile')
                        }
                        else if(!check){
                            // errors.push({msg:"Agree the terms..."})
                            req.flash('error_msg','Agree the terms...')
                            res.redirect('/dashboard/profile')
                        }
                        else if(semEdit <0 || semEdit>8){
                           
                            req.flash('error_msg','enter the valid sem details...')
                            res.redirect('/dashboard/profile')
                        }
                        else if(!branches.includes(branchEdit)){
                            req.flash('error_msg','Enter the correct branch...')
                            res.redirect('/dashboard/profile')
                        }
        
        else{
                
                
            bcrypt.compare(passwordEdit,user.password,(error,match)=>{
                if(error) return error
                if(!match)
                    {   
                        
                            errors.push({msg:'Password incorrect...'})
                            if(errors.length>0){
        
                                res.render('profile',{
                                    id : 'profile',
                                    name : usernameEdit,
                                    email:emailEdit,
                                    number:numberEdit,
                                    year:yearEdit,
                                    branch:branchEdit,
                                    sem:semEdit,
                                    errors
                                
                                    
                                })
                                
                                
                            }
                        
                    
                            
                    }
                else{
            user.email = emailEdit;
            user.name = usernameEdit;
            user.number = numberEdit;
            user.year = yearEdit;
            user.branch = branchEdit;
            user.sem=semEdit
            
            
            // bcrypt.genSalt(10,(error,salt)=>{
            //                         bcrypt.hash(passwordEdit,salt,(error,hash)=>{
            //                             if(error)
            //                             throw error
                    
            //                             user.password=hash
            //                         })})
                // return done(null,user)
                user.save()
                    .then((user)=>{
                        req.flash('success_msg','Profile Updated successfully log in to continue')
                        res.redirect('/users/login')
                    
                    })
                    .catch(err=>console.log(err)
                    )
                    
                }
            })
        
            
            // 

            // console.log(req.user);
            
            // res.redirect('/dashboard');
            if(errors.length>0){
        
                    res.render('profile',{
                        id : 'profile',
                        name : usernameEdit,
                        email:emailEdit,
                        number:numberEdit,
                        year:yearEdit,
                        branch:branchEdit,
                        sem:semEdit,
                        errors
                    
                        
                    })
                    
                    
                }
            
        
        }
    })
    
   
})
router.get('/qp',ensureAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/year.html"))
})



module.exports=router