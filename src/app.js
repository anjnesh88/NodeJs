const express = require('express');
const { connectDb } = require('./config/database');
const app = express();
let cookieParser = require('cookie-parser');

//To get the req in readable form
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


connectDb().then(()=>{
    console.log("Database connection is established");
    app.listen(3000, ()=>{
    console.log('server is running')
});
}).catch(err=>{
    console.error("Database cannot be connected: " + err);
})
