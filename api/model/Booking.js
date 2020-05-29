const mongoose = require("mongoose");

var Schema    = mongoose.Schema;

const BookingSchema = new mongoose.Schema({
doctor_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
},
patient_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
},
date_creted:{
    type:Date,
    required:true
},
message:{
    type:String,
    required:true
},
subject:{
    type:String,
    required:true
}
});

module.exports=mongoose.model("Booking",BookingSchema);
