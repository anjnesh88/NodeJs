const express = require('express');
const { connectDb } = require('./config/database');
const app = express();
let cookieParser = require('cookie-parser');
const cors = require('cors');

//To get the req in readable form
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Must be exact origin (not '*')
  credentials: true                // ✅ Allow credentials like cookies
}));

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


connectDb().then(()=>{
    console.log("Database connection is established");
    app.listen(3000, ()=>{
    console.log('server is running')
});
}).catch(err=>{
    console.error("Database cannot be connected: " + err);
})
