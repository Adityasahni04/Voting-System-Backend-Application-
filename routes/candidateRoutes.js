const express=require('express');
const router=express.Router();
const candidate=require('../modles/candidate')
const user=require('../modles/user')
const  {authenticate,genratetoken} = require('../jwt');

const checkadminrole=async(userid)=>{   //working
   try { 
      const userdata=await user.findById(userid);
       if(userdata.role==='admin')
         {
           return true;
         }
         else{
            return false;
         }
         
   } catch (error) {
      return false
    }

}
//voteing routes
router.get('/candidates',authenticate,async(req,res)=>{  //working
     try {  
        const userdata= await candidate.find();
        const filteredUserdata = userdata.map(user => ({
         candidateid:user.id,
         votecount: user.votecount,
         name: user.name,
         party: user.party,
         age: user.age
     }));
        res.status(200).json(filteredUserdata);
    console.log('candidate dispayed successfully');
     } catch (error) {
        res.status(500).json({message:'Internal server error'});
     }
    
})
router.post('/vote/:candidateid',authenticate,async(req,res)=>{  //working for admin //working voter
  // no admin can vote
  if(await checkadminrole(req.user.id)){
   return res.status(404).json({message:'admin is not allowed to vote'})
}
const candidateid=req.params.candidateid;
const userId=req.user.id;
try {
   const candidate1=await candidate.findById(candidateid);
   if(!candidate1) return res.status(403).json({message:'candinate not found'})
     const user1=await user.findById(userId) ;
   if(!user1) return res.status(403).json({message:'user not found'})
    if(user1.isVoted){
      return res.status(400).json({message:'user is already voted'})
    }
    candidate1.votes.push({user:userId})
    candidate1.votecount++;
    await candidate1.save();
   user1.isVoted=true;
   await user1.save()
   res.status(200).json({message:'vote recored successfully'})
} catch (error) {
   console.log(error);
   res.status(500).json(error);
}
})

router.get('/vote/count',authenticate,async(req,res)=>{    //working 
   const candidate1=await candidate.find().sort({votecount:'desc'})
   const filteredUserdata =candidate1.map((user)=>{
      return {votecount: user.votecount,
      name: user.name,
      party: user.party,
     }
  });
  res.status(200).json(filteredUserdata);
})

router.put('/candidates/:candinateid',authenticate,async(req,res)=>{ //working
   try {
      if(! await checkadminrole(req.user.id)){
         return res.status(404).json({message:'user does have admin role'})
      }
      const candidateid=req.params.candinateid;
      const newdata=req.body;
      const updatedCandinate=await candidate.findByIdAndUpdate(candidateid,newdata,{
         new:true,
         runValidators:true,
      })
      if(!updatedCandinate) return res.status(404).json({message:'candinate not found'})
      res.status(200).json({message:'candidate updated'})
   } catch (error) {
      console.log(error);
      res.status(500).json({message:'Internal server error'})
   }    
  
})
router.delete('/candidates/:candinateid',authenticate,async(req,res)=>{  //working
   try {
      if(! await checkadminrole(req.user.id)){
         return res.status(404).json({message:'user does have admin role'})
      }
      const candidateid=req.params.candinateid;
      const deletedCandinate= await candidate.findByIdAndDelete(candidateid)
      if(!deletedCandinate) return res.status(404).json({message:'candinate not found'})
      res.status(200).json({message:'candidate deleted'})
   } catch (error) {
      res.status(500).json({message:'Internal server error'})
   }    
  
})

router.post('/candidates',authenticate,async(req,res)=>{ //working
   try {
      if(! await checkadminrole(req.user.id)){
         return res.status(404).json({message:'user does have admin role'})
      }
      const data=req.body;
      const newcandinate=new candidate(data);
      const response=await newcandinate.save();
      res.status(200).json({message:'candidate saved'})
   } catch (error) {
      res.status(500).json(error)
   }
 

})

module.exports=router;