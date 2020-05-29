const nodeMailer = require("nodemailer");
require('dotenv').config();

let transporter = nodeMailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

const sendEmail= (options,cb) =>{
    transporter.sendMail(options,(err,data)=>{
       if(err)
         return cb(err)

        return cb(err,data);
    });
}

module.exports = {
    sendEmail
};