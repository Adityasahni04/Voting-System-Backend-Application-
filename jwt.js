const jwt=require('jsonwebtoken');
require('dotenv').config();

const authenticate=(req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if(!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
}

const genratetoken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:300})
}


module.exports={authenticate,genratetoken}