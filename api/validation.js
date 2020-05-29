//validation
const joi = require("joi");

//register validation
const registerValidation= (data) =>{
    const schema={
       user_name:joi.string().min(6).required(),
       password:joi.string().min(6).required(),
       confirm_password:joi.string().min(6).required(),
       first_name:joi.string().required(),
       last_name:joi.string().required(),
       email:joi.string().min(6).required().email(),
       dob:joi.string().min(6).required(),
       phone_number:joi.string().min(8).required(),
       address:joi.string().min(4).required(),
       type:joi.string().min(4).required(),
       gender:joi.string().min(4).required(),
       gp_reg_number:joi.string().min(6)
    };
    return joi.validate(data,schema);
}

const loginValidation= (data) =>{
    const schema={
       // email:joi.string().min(6).required().email(),
        password:joi.string().min(6).required()
    };
    return joi.validate(data,schema);
}

module.exports = {
    registerValidation,
    loginValidation
}



