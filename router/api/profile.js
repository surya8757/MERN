const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const user=require("../../models/User")
const {check,validationResult}=require('express-validator');

//@route get api/profile/me
//@desc get current users profile
//@access Private


router.get('/me',auth,async(req,res)=>{
    try{
        console.log(req.user.id);
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is profile for this user'});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route POST api/profile/me
//@desc create or update user profile
//@access Private

router.post('/',[
    check('status','Status is required')
    .not()
    .isEmpty(),
    check('skills','skills is required')
    .not()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkdin
    }=req.body;
    //Build profile object
    const profileFields={};
    console.log(req.users);
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    // profileFields.social={};
    // if(youtube) profileFields.social.youtube=youtube;
    // if(twitter) profileFields.social.twitter=twitter;
    // if(facebook) profileFields.social.facebook=facebook;
    // if(linkdin) profileFields.social.linkdin=linkdin;
    // if(instagram) profileFields.social.instagram=instagram;

    // //update and insert data;
    // try{
    //     let profile=await Profile.findOne({user:req.user.id});
    //     if(profile){
    //         //update
    //         profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
    //     };
    //     return res.json(profile);
    //     //create
    //     profile=new Profile(profileFields);
    //     await Profile.save();
    //     res.json(profile);
    // }catch(err)
    // {
    //     console.error(err.message);
    //     res.status(500).send('Server Error');
    // }
})

module.exports=router;