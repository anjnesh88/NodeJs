const express = require('express');
const { connectDb } = require('./config/database');
const { User } = require('./models/user');
const app = express();

//To get the req in readable form
app.use(express.json());

app.post("/signUp", async (req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error saving the user: " + err.message)
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
app.patch("/updateUser", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId, data);
        res.send('User updated successfully')
    }catch(err){
       res.status(400).send("Something went wrong"); 
    }
});

//Update data of the user by using email id
app.patch("/updateUserByEmailId", async(req, res)=>{
    const {emailId} = req.body.emailId;
    const data = req.body;
    console.log(emailId, data)
    try{
        const user = await User.findOneAndUpdate(emailId, data);
        res.send("User updated successfully using email id");
    }catch(err){
       res.status(400).send("Something went wrong"); 
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
