const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
  user_name:{
    type: String,
    required: true,
    max: 255
  },
  password:{
    type: String,
    required: true,
    max: 255
  },
  first_name:{
    type: String,
    required: true,
    max: 255
  },
  last_name:{
    type: String,
    required: true,
    max: 255
  },
  email:{
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  dob:{
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  phone_number:{
    type: String,
    required: true,
    min: 8,
    max: 10
  },
  address:{
    type: String,
    required: true,
    max: 255
  },
  type:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true,
    max: 10
  },
  gp_reg_number:{
    type: String,
    required: false
  },
  medical_history:{
    type: String,
    required: false
  }
})

module.exports=mongoose.model("User",userSchema);
