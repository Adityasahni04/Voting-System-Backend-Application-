const mongoose=require('mongoose');
const url='mongodb://127.0.0.1:27017/VoteingDatabase'

mongoose.connect(url);
const db=mongoose.connection;
db.on('connected',()=>{
    console.log('database is connected')
})
db.on('disconnected',()=>{
    console.log('database is disconnected')
})
db.on('error',()=>{
    console.log('error while connecting');
})


module.exports=db;