const mongoose = require("mongoose");
var Schema    = mongoose.Schema;

const notesSchema = new mongoose.Schema({
  created_date:{
    type:Date,
    required:true
  },
  last_updated:{
    type:Date,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  note:{
    type:String,
    required:true
  },
  patient_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
}
});


module.exports=mongoose.model("Note",notesSchema);

