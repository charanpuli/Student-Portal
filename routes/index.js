var express=require('express')
var path=require('path')
var router=express.Router()

//home route
router.use('/',express.static(path.join(__dirname,'../public')));

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/home.html'))
})
// router.get('/',(req,res)=>{
//     res.render('home',{
//         id:'Student Connect'
    
//     })
// })









module.exports=router