const express=require('express');
const db=require('./database')
const bodyparser=require('body-parser')
const userRoutes=require('./routes/userRoutes')
const candidateRoutes=require('./routes/candidateRoutes')
const app = express();
require('dotenv').config();

app.use(bodyparser.json())
const PORT=process.env.PORT|| 4040
app.use('/',userRoutes);
app.use('/',candidateRoutes);
app.listen(PORT,()=>{
    console.log(`server is listing Port:${PORT}`)
})