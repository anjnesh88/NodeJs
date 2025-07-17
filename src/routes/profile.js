const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const cookieParser = require('cookie-parser');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
var validator = require('validator');

profileRouter.use(express.json());
profileRouter.use(cookieParser());

profileRouter.get("/profile/view", userAuth,  async(req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated succesfully`,
            data: loggedInUser
        });
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
});

profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        if(req.body.oldPassword){
            const isPasswordValid = await bcrypt.compare(req.body.oldPassword, loggedInUser.password);
            if(isPasswordValid){
                if(!validator.isStrongPassword(req.body.newPassword)){
                    throw new Error("Enter a strong password: " + req.body.newPassword);
                }
                const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
                const user = await User.findByIdAndUpdate(loggedInUser._id, {password: passwordHash});
                user.save();
                res.send("Password updated successfully!");
            }else{
                throw new Error("Password is not correct");
            }
        }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = profileRouter;