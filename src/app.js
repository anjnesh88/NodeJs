const express = require('express');
const { connectDb } = require('./config/database');
const { User } = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const app = express();
const bcrypt = require("bcrypt");
const validator = require('validator');
let cookieParser = require('cookie-parser');
let jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

//To get the req in readable form
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res)=>{
    try{    
    //Validation of the data
    validateSignUpData(req);
    
    //Encrypt the password
    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    //Creating the new instance of the User model
    const user = new User({firstName, lastName, emailId, password: passwordHash});
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});

//Login API
app.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId});
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Email address: " + value);
        }
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            //Create a JWT Token
            const token = await jwt.sign({_id: user._id}, "Vasu@123",{ expiresIn: '1d'});
            
            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("User Logged in successful!");
        }else{
            throw new Error("Password is not correct");
        }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

//get user profile for checking cookie
app.get("/profile", userAuth,  async(req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});

app.post("/sendConnectionRequest", userAuth, async(req, res)=>{
    const user = req.user;
    res.send(user.firstName + " sent the connection request");
})

connectDb().then(()=>{
    console.log("Database connection is established");
    app.listen(3000, ()=>{
    console.log('server is running')
});
}).catch(err=>{
    console.error("Database cannot be connected");
})
