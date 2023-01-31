const express=require('express');
const app=express();

app.get('/',(req,res)=>res.send('API RUNNING'));


//process.env.PORT enverment variable check such where it deployed and local port is 5000;
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server started on port ${PORT}`));