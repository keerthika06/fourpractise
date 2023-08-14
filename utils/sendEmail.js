var nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    host : "imappro.zoho.in",
    secure : true,
    port : 465,
    ignoreTLS: true,
	logger: true,
	debug: true,
	send: true,
    auth : {
        user:process.env.ZOHO_MAIL,
        pass : process.env.ZOHO_PASS,
    }


})
const sendEmail = async(email,subject,text)=>{
    let mailOptions = {
        from : process.env.ZOHO_MAIL,
        to :email,
        subject,
        text
    }
    await new Promise((resolve,reject) =>{
        transporter.sendEmail(mailOptions,function(error,info){
            if(error){
                reject(error)
            }
            console.log("email sent.PLease check your Email ID "+info.response)
            resolve(info)
        })
    })
    return true
}
module.exports = {sendEmail}