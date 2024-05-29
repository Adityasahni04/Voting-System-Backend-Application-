const express=require('express');
const user=require('./../modles/user');
const  {authenticate,genratetoken} = require('../jwt');
router=express.Router();
router.get('users/profile',authenticate,async(req,res)=>{
     const data=req.user;
    try {
        const response=await user.findById(data.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    } 
})
router.put('users/profile/password',authenticate,async(req,res)=>{
    const userId=req.user.id;
    const  currentPassword = req.body.currentPassword;
    const newPassword=req.body.newPassword;
    const userdata= await user.findById(userId);
    if (!userdata || !(await userdata.comparePass(currentPassword))) {
        return res.status(401).json({ error: 'Invalid current password' });
    }
        userdata.password=newPassword;
        await userdata.save();
        console.log('password changed')
        res.status(200).json({message:'password updated'})
})
router.post('/signup',async(req,res)=>{
 try{
    const data=req.body;
    if(data.role==='admin')
        {
            console.log("if is working")
            const checkuser=await user.findOne({role:'admin'})
            if(checkuser)return res.status(405).json({message:'no more admins'});
        }
    const newuser=new user(data);
    const response= await newuser.save()
    const payload={
       id:response.id,
    }
    const token=genratetoken(payload);
    res.status(200).json({response:response,token:token})
 }
 catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error'})
 }

})
router.post('/signin',async(req,res)=>{
    try {
        
        const responseuser=req.body;
        const presentuser= await user.findOne({aadharCardNumber:responseuser.aadharCardNumber})
        if(!presentuser) return res.status(402).json({message:'User data not found'})
        const ispassword=await presentuser.comparePass(responseuser.password);
        if (ispassword) {
            const payload={
                id:presentuser.id,
             }
             const token=genratetoken(payload);
            res.status(200).json({message:'correct username and password',token:token})
        } else {
            res.status(404).json({message:'Wrong password'})
        }
     
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    } 
})

module.exports=router;