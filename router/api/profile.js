const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const User=require("../../models/User")
const {check,validationResult}=require('express-validator');

//@route get api/profile/me
//@desc get current users profile
//@access Private



router.get('/me',auth,async(req,res)=>{
    try{
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
    .not(),
    auth
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
    console.log(profileFields.user);
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(linkdin) profileFields.social.linkdin=linkdin;
    if(instagram) profileFields.social.instagram=instagram;

    //update and insert data;
    try{
        let profile=await Profile.findOne({user:req.user.id});
        if(profile){
            //update
            profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
        };
        //create
        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route Get api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public

router.get('/user/:user_id',async(req,res)=>{
    try{
        const profile=await Profile.find({user:req.params.user_id}).populate('user',['name','avatar']);
        console.log(profile);

        if(!profile)
        {
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    }catch{
        console.error(err.message);
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});


//@route DELETE api/profile 
//@desc Delete profile,user & post
//@access Private

router.delete('/',auth,async(req,res)=>{
    try{
        //@todo -remove users posts
        //Remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove user
        await User.findByIdAndRemove({_id:req.user.id});
        res.json({msg:'User  deleted'});
    }catch{
        console.error(err.message);
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});


//@route PUT api/profile 
//@desc Add profile exprience
//@access Private

router.put('/experience',[auth,
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('form','From data is required').not().isEmpty(),
    ],async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()});
        }


        const {
            title,
            company,
            location,
            form,
            to,
            current,
            description
        }=req.body;
        const newExp={
            title,
            company,
            location,
            form ,
            to,
            current,
            description
        }
        try {
            const profile=await Profile.findOne({user:req.user.id});
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

});

//@route DELETE api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access private

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id});

        //get remove index
        const removeIndex=profile.experience
        .map(item=>item.id)
        .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})




module.exports=router;