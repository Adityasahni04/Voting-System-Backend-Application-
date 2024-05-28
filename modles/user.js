const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const userschema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});
userschema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')) return next();
    try {
    const salt=await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(user.password,salt);
    user.password=hashedpassword;
    next()
    } catch (error) {
        return next(error);
    }
    
})
userschema.methods.comparePass = async function(recivePass){
   try {
        const verify=bcrypt.compare(recivePass,this.password)
        return verify;
   } catch (error) {
     throw error;
   }
}
const user=mongoose.model('user',userschema);
module.exports=user;
