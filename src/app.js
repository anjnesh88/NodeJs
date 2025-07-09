const express = require('express');
const { connectDb } = require('./config/database');
const { User } = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const app = express();
const bcrypt = require("bcrypt")

//To get the req in readable form
app.use(express.json());

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

//Get user by email
app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;
    try{
        const users = await User.find({emailId: userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }
    }catch (err){
        res.status(400).send("Something went wrong")
    }
})

//Feed API - get /Feed - get all user from the database;
app.get("/feed", async (req, res)=>{
    try{
        const allUser = await User.find({});
        if(allUser.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(allUser);
        }
    }catch(err){
       res.status(400).send("Something went wrong"); 
    }
})

//Delete API
app.delete("/deleteUser", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
       res.status(400).send("Something went wrong"); 
    }
})

//Update data of the user by using id
app.patch("/updateUser/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{    
        const allowed_Update = ["userId","photoUrl", "about", "age", "skills"];

        const isUpdateAllowed = Object.keys(data).every(keys =>
            allowed_Update.includes(keys)
        );

        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate(userId, data, {runValidators: true});
        res.send('User updated successfully')
    }catch(err){
       res.status(400).send("Update failed: "+ err.message); 
    }
});

//Update data of the user by using email id
app.patch("/updateUserByEmailId/:emailId", async(req, res)=>{
    const {emailId} = req.params?.emailId;
    const data = req.body;
    try{
        const user = await User.findOneAndUpdate(emailId, data, {runValidators: true});
        res.send("User updated successfully using email id");
    }catch(err){
       res.status(400).send("Update failed: "+ err.message); 
    }
})

connectDb().then(()=>{
    console.log("Database connection is established");
    app.listen(3000, ()=>{
    console.log('server is running')
});
}).catch(err=>{
    console.error("Database cannot be connected");
})
