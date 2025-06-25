const express = require('express');
const app = express();

app.use((req,res)=>{
    res.send('Hello from the server')
});

app.use('/test',(req,res)=>{
    res.send('Hello from the test')
})

app.listen(3000, ()=>{
    console.log('server is running')
});