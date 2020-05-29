const router = require("express").Router();
const moment =require("moment");

const GlucoseLevel = require("../model/GlucoseLevel");
const User = require("../model/User");
const Booking = require("../model/Booking");
const FeedBack= require("../model/GlucoseLevelFeedback");
const {sendEmail}  =require("../middlewares/sendMail");

const Note =require("../model/PersonalNotes");

router.post("/addGlucoseLevel", async (req, res) => {
       const {
        before_breakfast,
        breakfast,
        after_breakfast,
        before_lunch,
        lunch,
        after_lunch,
        before_dinner,
        dinner,
        after_dinner,
        before_bed,
        bed_time,
        bood_pressure,
        during_night,
        comment,
        user
       }  =req.body;
      const glucoseLevel= new GlucoseLevel({
        date:new Date(),
        before_breakfast,
        breakfast,
        after_breakfast,
        before_lunch,
        lunch,
        after_lunch,
        before_dinner,
        dinner,
        after_dinner,
        before_bed,
        bed_time,
        bood_pressure,
        comment,
        user,
        during_night
      });
 try {
    const saved = await  glucoseLevel.save();
    res.send(saved)
 } catch (error) {
     console.log('error:', error)
     
 }
 
});


router.get("/glucoseFeedback/:gid", async (req, res) => {
  
try {
  const feedback = await  FeedBack.find({user:req.params.gid});
   res.send(feedback)
} catch (error) {
console.log('error:', error)

}

});


router.post("/updateGlucoseLevel/:id", async (req, res) => {
  
try {
const saved = await GlucoseLevel.findByIdAndUpdate(req.params.id,{...req.body});

const patient =await User.findOne({_id:saved.user});

const doctor =await User.findOne({gp_reg_number:patient.gp_reg_number,type:"Doctor"});



const mailOptions={
  from:"diabeteshealthmanagement@gmail.com",
  to:doctor.email,
  subject: "Glucose Level Update",
  text: `${patient.first_name} has updated his/her Glucose Level Date on ${saved.date}`
}
sendEmail(mailOptions,(err,data)=>{
  if(err){
   res.status(400).send(err.details);
  }

  res.send(saved)
})


} catch (error) {
console.log('error:', error)

}

});

router.get("/getGlucoseRecordsByUser/:id",async (req,res)=>{
  const {id} =req.params;
  const glucose = await GlucoseLevel.find({user:id});
  res.send(glucose)
});

router.delete("/glucoseLevel/:id",async (req,res)=>{
     const {id}= req.params;
     const resposnse = await GlucoseLevel.deleteOne({_id:id});
     res.send(resposnse);

}); 

router.post("/booking",async (req,res,next)=>{
  try {
    const {patient_id,email,subject,message} =req.body;
    const doctor =await User.findOne({email});
    if(!doctor)
       return res.status(400).send("Doctor not found change");
    
      const boooking= new Booking({
        doctor_id:doctor._id,
        patient_id,
        date_creted: new Date(),
        message,
        subject
      });
      await boooking.save();
      const bookings= await Booking.find({patient_id});
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

        res.send(bookings);
    })
     
  } catch (error) {
    
    res.status(400).send(error.details);
  }
 
})

router.get("/booking/:id",async (req,res,next)=>{
   try {
       const bookings = await Booking.find({patient_id:req.params.id});
       res.send(bookings);
   } catch (error) {
      return next(error);
   }
});

router.get("/notes/:userId",async(req,res,next)=>{
  try {
    const notes = await Note.find({patient_id:req.params.userId});
    res.send(notes);
  } catch (error) {
    return next(error)
  }
});

router.post("/notes",async (req,res,next)=>{
  try {
     const {patient_id,title,note,date,_id} = req.body;
     console.log('patient_id,title,note,date:', patient_id,title,note,date)
     const [day,month,year] =date ?  date.split("."):[];
     const noteDate = date ? new Date(month+"."+day+"."+year) :new Date();
     if(_id){
      
       await Note.findByIdAndUpdate(_id,{...req.body,last_updated:new Date(),date:noteDate});
       
     }else{
      const newNote= new Note({
        patient_id,
        note,
        title,
        date:noteDate ,
        last_updated:new Date(),
        created_date:new Date()
       });
       await newNote.save();
     }

     
     const notes = await Note.find({patient_id});
     res.json(notes);
  } catch (error) {
    return next(error);
  }
});


router.delete("/notes/:id",async (req,res)=>{
  const {id}= req.params;
  const resposnse = await Note.deleteOne({_id:id});
  res.send(resposnse);

});

router.get("/myGlucoseChart/:userId",async(req,res,next)=>{
   try {

       const glucoseList=await GlucoseLevel.find({date:{
           $gte:moment().subtract('days', 8).toISOString(),
            $lt: new Date()
        },user:req.params.userId});
      
        const chartData={};
         const fieldsInAverage={
          before_breakfast:"",
          after_breakfast:"",
          before_lunch:"",
          after_lunch:"",
          before_dinner:"",
          after_dinner:"",
          before_bed:""
         }
        glucoseList.forEach(glucose=>{
          let sum=0;
          Object.keys(fieldsInAverage).forEach(field=>{
              sum+=glucose[field];
          })
          chartData[glucose.date]=sum/7;
        });

       res.send(chartData)
   } catch (error) {
   
     res.status(404).send("error");
   }
});

module.exports = router;