var express =require('express')
var path=require('path')
var app=express()
var expressLayouts=require('express-ejs-layouts')
var port = process.env.PORT || 3000
var bodyparser=require('body-parser')
var flash=require('connect-flash')
var db=require('./config/string').mongoURI
var mongoose=require('mongoose')
var session=require('express-session')

var passport =require('passport')

app.use(bodyparser.urlencoded({extended:false}))

app.use(expressLayouts)

app.set('view engine','ejs')

app.use(flash())

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }))

//passport 

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)
//database connection
mongoose.connect(db,{useNewUrlParser:true})
        .then(()=>console.log('mongo db connected successfully...')
        )
        .catch(err=>console.log(err))
// console.log(promise);

    app.use((req,res,next)=>{
            res.locals.success_msg=req.flash('success_msg')
            res.locals.error_msg=req.flash('error_msg')
            res.locals.error=req.flash('error')
            next()
        
          })

app.use('/',require('./routes/index'))
// app.use('/',express.static(path.join(__dirname,'/public')))

//dashboard

app.use('/dashboard',require('./routes/dashboard'))

//user route

app.use('/users',require('./routes/users'))

//messages

app.use('/upload',require('./routes/upload'))


app.listen(port,()=>{
    console.log(`app is running on port ${port}`);
    
})

