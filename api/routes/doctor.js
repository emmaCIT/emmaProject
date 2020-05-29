
const GlucoseLevel = require("../model/GlucoseLevel");
const User = require("../model/User");
const routes = require("express").Router();
const Booking = require("../model/Booking");
const FeedBack= require("../model/GlucoseLevelFeedback");

const {sendEmail}  =require("../middlewares/sendMail");

 routes.get('/glucoseLevelByPatient/:pid', async (req,res,next)=>{
     try {
        const {pid} =req.params;
        const obj= pid.includes("@") ? {email:pid}:{_id:pid}
        const userOne = await User.findOne({ ...obj });
        const response = await GlucoseLevel.find({user:userOne._id});
        res.send(response);
     } catch (error) {
         console.log('error:', error);  
     }
 });

 routes.post("/updateInsulinLevel/:id",async(req,res,next)=>{
    try {
        const updatedGlucoseLevel = await GlucoseLevel.findByIdAndUpdate(req.params.id,{...req.body});
        const response = await GlucoseLevel.find({user:updatedGlucoseLevel.user});
        res.send(response);
        
    } catch (error) {
         console.log('error:', error)
         
    }
 })

 routes.post("/addFeedback/:id",async(req,res,next)=>{
     try {
          const {feedback} =req.body;
         const glucoseLevel= await GlucoseLevel.findOne({_id:req.params.id})
         const glucosefeedback= new FeedBack({
            user:glucoseLevel.user,
            glucode_level_date:glucoseLevel.date,
            date: new Date(),
            feedback
          });

          
          const saveFeedback=await glucosefeedback.save();
         res.send("feedback added");
     } catch (error) {
         console.log('error:', error)
         
     }
 })

 routes.get("/myBookings/:id",async(req,res,next)=>{
    
    try {
        const bookings = await Booking.find({doctor_id:req.params.id});
        const patinetIds = bookings.map(item => item.patient_id);
        const users = await User.find({_id: {$in: patinetIds}});
        console.log('patinetIds:', users);
        const bookinsRes=[]
        bookings.forEach(booking=>{
            const obj={date:booking.date_creted,message:booking.message,patient_id:booking.patient_id};
            users.forEach(user=>{
                
                if(booking.patient_id==user.id){
                   obj["email"]=user.email;
                   obj["full_name"]=user.first_name + " "+user.last_name;
                }
            });
            bookinsRes.push(obj)
        });
    
        res.send(bookinsRes);
       
    } catch (error) {
       return next(error);
    }
 });

routes.post("/notifyPatient",(req,res,next)=>{
    try {
       const {subject,message,email}= req.body;
       console.log('subject,message,email:', subject,message,email)
       const mailOptions={
           from:"diabeteshealthmanagement@gmail.com",
           to:email,
           subject: subject,
           text: message
       }
       sendEmail(mailOptions,(err,data)=>{
           if(err){
            res.status(400).send(err.details);
           }

           res.send(data);
       })
    } catch (error) {
        res.status(400).send(error.details);
    }
})

routes.get("/patientList/:gp_reg_number",async (req,res,next)=>{
    try {
      const {gp_reg_number} =req.params;
      let patients= await User.find({gp_reg_number})
       patients = patients.filter(pat => pat.type.toLowerCase() !=="doctor");
      res.send(patients);
    } catch (error) {
        res.status(400).send(error.details);
    }
})

module.exports = routes;
