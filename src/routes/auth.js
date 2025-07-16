const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require('../models/user');
const validator = require('validator');

authRouter.post("/signUp", async (req, res)=>{
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

authRouter.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId});
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Email address: " + emailId);
        }
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //Create a JWT Token
            const token = await user.getJWT();
            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("User Logged in successfully!");
        }else{
            throw new Error("Password is not correct");
        }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});

authRouter.post("/logout", async(req, res)=>{
    try{
        res.clearCookie("token");
        res.send("User Logged out succedfullly")
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});


module.exports = authRouter;