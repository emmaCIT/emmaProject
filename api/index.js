const express=require("express");
const mongoose= require('mongoose');
const cors =require("cors");
require('dotenv').config();
const app= express();

//Import routers 
const authRouter= require("./routes/auth");
const patientRouter= require("./routes/patient");
const doctorRouter = require("./routes/doctor");
const db_url=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-r2chw.mongodb.net/diabates?retryWrites=true&w=majority`;

mongoose.connect(db_url,{useNewUrlParser: true,useUnifiedTopology: true } )
    .then(() =>{
         console.log("db connected");
    }).catch(e=>{
        console.log(e);
    });

//middlewares
app.use(cors())
app.use(express.json())

//Route middlewares
app.use("/api/user",authRouter);
app.use("/api/patient",patientRouter);
app.use("/api/doctor",doctorRouter)
app.listen(3003,()=>{ console.log("app runing on Port 3002");});