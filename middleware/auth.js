const jwt=require('jsonwebtoken');
const config=require('config');
const Profile = require('../models/Profile');

module.exports=function(req,res,next){
   //Get token form header
   const token=req.header('x-auth-token');
   //check if not token
   if(!token){
      return res.status(401).json({msg:'No token,autherization denied'});
   }

   //varify toekn
   try{
      const decoded=jwt.verify(token,config.get('jwtSecret'));
      req.user=decoded.user;
      next();
      const profile=Profile.findOne({users:req.user.id});
   }catch(err)
   {
      res.status(401).json({msg:'Token is not valid'});
   }
};