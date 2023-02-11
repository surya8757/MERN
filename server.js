const express=require('express');
const connectDB=require('./config/db');
const app=express();
connectDB();

//init middleware
app.use(express.json({extended:false}));
app.get('/',(req,res)=>res.send('API RUNNING'));


//Define Routes
app.use('/api/users',require('./router/api/users'));
app.use('/api/post',require('./router/api/post'));
app.use('/api/profile',require('./router/api/profile'));
app.use('/api/auth',require('./router/api/auth'));
//process.env.PORT enverment variable check such where it deployed and local port is 5000;
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server started on port ${PORT}`));