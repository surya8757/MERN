const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check,validationResult}=require('express-validator');
const auth=require('../../middleware/auth');
const User=require('../../models/User');



//@route get api/auth
//@desc Authenicate user & get token
//@access Public




router.get('/',auth,async(req,res)=>{
   try{
      const user=await User.findById(req.user.id).select('-password');
      res.json(user);
   }catch(err){
      console.error(err.messsage);
      res.status(500).send('Server Error');
   }
});


//login user
router.post('/',[
   check(
      'email',
      'please include a valid email').isEmail(),
   check(
   'password',
   'please is require').exists()
],
async(req,res)=>{

   const errors=validationResult(req);
   if(!errors.isEmpty){
      return res.status(400).json({errors:errors.array()});
   }

const {email,password}=req.body;

try{
   let user=await User.findOne({email});

   if(!user){
      res.status(400).json(errors[{msg:"Invalid Credentials"}]);
   }

const  isMatch=await bcrypt.compare(password,user.password);

if(!isMatch){
   return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
}



const payload={
   user:{
      id:user.id
   }
}


jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
   if(err) throw err;
   res.json({token});
});
}catch(err){
console.error(err.message);
res.status(500).send('server error');
}});



module.exports=router;