const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');
const app = express();

//Handle Auth Middlewares for all GET POST, ...requests
app.use("/admin", adminAuth);


app.get("/user", userAuth, (req, res)=>{
    res.send("User data sent");
});

app.get("/admin/getAllData", (req, res)=>{
    res.send("All data sent")
})

//This will match all the HTTP method API call to /test
// app.use('/test',(req,res)=>{
//     res.send('Hello from the test')
// });

// //This will only handle get call to /user
// app.get("/user", (req, res)=>{
//     res.send({firstName: "Anjnesh", lastName: "Vasudeva"})
// })

// //This will only handle post call to /user
// app.post("/user", (req, res)=>{
//     console.log("Save data to database");
//     res.send("Data saved successfully");
// })

// app.delete("/user", (req, res)=>{
//     res.send("Data deleted successfully");
// })

app.get("/user/:userId/:name/:password", (req, res)=>{
    console.log(req.params);
    res.send({firstName: "Anjnesh", lastName: "Vasudeva"})
})

app.listen(3000, ()=>{
    console.log('server is running')
});