const mongoose = require("mongoose");

var Schema    = mongoose.Schema;

const GlucoseLevelSchema = new mongoose.Schema({
    date:{
      type:Date,
      required:true
    },
    before_breakfast:{
       type:Number,
       required:true 
    },
    breakfast:{
        type:Number,
        required:true 
     },
    after_breakfast:{
        type:Number,
        required:true 
     },
    before_lunch:{
        type:Number,
        required:true 
    },
    lunch:{
        type:Number,
        required:true 
     },
    after_lunch:{
        type:Number,
        required:true 
     },
    before_dinner:{
        type:Number,
        required:true 
     },
    dinner:{
        type:Number,
        required:true 
     },
    after_dinner:{
        type:Number,
        required:true 
     },
    before_bed:{
        type:Number,
        required:true 
     },
    bed_time:{
        type:Number,
        required:true 
     },
    bood_pressure:{
        type:Number,
        required:true 
     },
    comment:{
        type:String,
        required:true 
     },
    user:{
        type: Schema.Types.ObjectId,
         ref: 'User' 
    },
    during_night:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model("GlucoseLevel",GlucoseLevelSchema);






