const mongoose=require('mongoose');
const candidateschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    party:{
        type:String,
        required:true,
        unique:true,
        },
    age:{
        type:String,
        required:true,
    },
    votes:[
            {
                user:{
                type:mongoose.Schema.ObjectId,
                ref:'user',
                required:true,
                },
                time:
                {
                    type:Date,
                    default:Date.now(),
                },
            }
    ],
    votecount:{
      type:Number,
      default:0,
    }
})




const candidate=mongoose.model('candidate',candidateschema);
module.exports=candidate;