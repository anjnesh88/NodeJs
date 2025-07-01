const express = require('express');
const { connectDb } = require('./config/database');
const { User } = require('./models/user');
const app = express();

app.post("/signUp", async (req, res)=>{
    const userObj = {
        firstName: "Anjnesh",
        lastName: "Vasudeva",
        emailId: "anjnesh.vasudeva@gmail.com",
        password: "vasu1234"
    }

    const user = new User(userObj);
    try{
        await user.save();
        res.send("User added successfully");
    } catch(err){
        res.status(400).send("Error saving the user: " + err.message)
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
