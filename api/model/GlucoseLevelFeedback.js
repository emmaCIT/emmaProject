const mongoose = require("mongoose");

var Schema    = mongoose.Schema;

const GlucoseLevelFeedbackSchema = new mongoose.Schema({
    date:{
      type:Date,
      required:true
    },
    glucode_level_date:{
        type:Date,
        required:true
    },
    feedback:{
        type:String,
        required:true 
     },
    user:{
        type: Schema.Types.ObjectId,
         ref: 'User' 
    }
});

module.exports=mongoose.model("FeedBack",GlucoseLevelFeedbackSchema);






