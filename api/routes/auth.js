const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../model/User");

const { registerValidation,loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //validate data
  const { error } = registerValidation(req.body);
  console.log('req.body:', req.body,error)
  const { user_name,
      password,
    first_name,
    last_name,
    email,
    dob,
    phone_number,
    address,
    type,
    gender,
    gp_reg_number } = req.body;
  
  if (error) return res.status(400).send(error.details);

  //check if the user is already in our Db
  const emailExist = await User.findOne({ email });
  console.log(email);
  if (emailExist) return res.status(400).json("Email Already Exist");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    user_name,
    password:hashPassword,
    first_name,
    last_name,
    email,
    dob,
    phone_number,
    address,
    type,
    gender,
    gp_reg_number
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login",async (req,res)=>{
    const{email,password} =req.body;
    const {error}= loginValidation({password});
     if(error) return res.status(400).send(error);
    
    //check if the user exist by the email or User Name
    const user= await User.findOne( { $or: [ { email}, {user_name:email} ] } )
    if(!user)  return res.status(400).send("Email or password is wrong");
    console.log(password,user.password);
    //if pasword is correct 
    const validdPass=await bcrypt.compare(password,user.password);
    if(!validdPass) return res.status(401).send("invalid password");

    //create and assign a token
    const {_id,first_name,last_name,type,gp_reg_number} = user;
    const token=jwt.sign({id:_id,first_name,last_name,type,gp_reg_number,loggedIn:true},process.env.TOKEN_SECRET);
     res.json({token});
    
})


router.post("/changePassword",async (req,res)=>{
  const{old_password,
        new_password,
        id} =req.body;
       
  const {error}= loginValidation({password:new_password});
   if(error) return res.status(400).send(error);
  
  //check if the user exist
  const user= await User.findOne( { _id:id } );
  
  if(!user)  return res.status(400).send("password is wrong");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(new_password, salt);
  user.password=hashPassword;
   console.log('hashPassword:', hashPassword)
  const response= await user.save();
   console.log('response:', response)
   res.json("updated");
  
})

router.get("/:id",async (req,res,next)=>{
   try {
     const {id}=req.params;
     const body =await User.findOne({_id:id});
     res.send(body);
   } catch (error) {
     return next(error)
   }
});

router.post("/update", async (req, res) => {
  //validate data
 
  const {  
  user_name,
  first_name,
  last_name,
  email,
  dob,
  phone_number,
  address,
  type,
  gender,
  medical_history} = req.body;

  //check if the user is already in our Db
  const emailExist = await User.findOne({ email });
  
  emailExist.user_name=user_name;
  emailExist.first_name=first_name;
  emailExist.last_name=last_name;
  emailExist.dob=dob;
  emailExist.phone_number=phone_number;
  emailExist.address=address;
  emailExist.type=type;
  emailExist.gender=gender;
  try {
    const savedUser = await emailExist.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});



module.exports = router;
