

var mongoose=require('mongoose')

var UserSchema=mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    number :{
        type : String,
        required : true
    },
    year :{
        type : String,
        required : true
    },
    branch :{
        type : String,
        required : true
    },
    sem :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    }




})

module.exports=User=mongoose.model('User',UserSchema)