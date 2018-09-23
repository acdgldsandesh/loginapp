var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;

var db;
//use es6 for callback to get assign db handler to global variable
MongoClient.connect('mongodb://localhost:27017/userlogin',(err,client) => {
    if (err) return console.log(err);
    db = client.db('userlogin');
    console.log('database connected');
})

router.get("/",function(req,res){
    res.render("index");//index.ejs from views is rendererd here
})

//Register page get method
router.get("/signup",function(req,res){
    res.render("signup",{name:null});//signup.ejs from views is rendered here
})

//on register
router.post("/signup",function(req,res){
    if(req.body.name && req.body.password) {
        db.collection('users').find({name:req.body.name}).toArray((err,result) => {
            if(result.length != 0){//if username already exists give error message in register page
                res.render("signup",{name:"User name " +  req.body.name + " is already in use <br>"});
            }else{//if username is unique insert user details to database
                db.collection('users').insert({name:req.body.name,password:req.body.password,mobile:req.body.mobile,email:req.body.email}).then(success => {
                    res.redirect("/login")
                }).catch(error => null);  
            }
        })  
    }
    else {
        res.render("signup",{name:null});
    }
})

router.get("/login",function(req,res){
    res.render("login",{err:null});
})

router.post("/login",function(req,res){
    //check user with particular username and password exists
    db.collection('users').findOne({$and:[
        {'name':req.body.name},
        {'password':req.body.password}
    ]}).then(success => {
       if(success){//if either password or username is wrong or null success will be null 
            res.render("logindetail",{user:success});//success object will have user information in json
       }else{
           res.render("login",{err:"Username or Password is incorrect <br>"})
       }
    });
})

module.exports = router;