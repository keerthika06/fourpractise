const {User} = require("../models/index")
const { sendEmail } = require("../utils/sendEmail")
const jwt = require("jsonwebtoken")
const {totp} = require("otplib")
totp.options = {step:300,digits:4}
const bcrypt = require("bcrypt")


const generateOTP = async(req,res) =>{
    const {email} = req.query
    try{
        const userFound = await User.findOne({email})
        if(!userFound)
        {
            return 
            res.status(401).json({
                status: false,
                statusCode: 401,
                message: "User does not exist",

        })


    }
    else{
        const secret = process.env.OTP_SECRET_KEY + email
        const token = toptp.generate(secret)

        const subject = " OTP VERIFICATON FOR PASSWORD"
        const text = `To Verify Your Email Address, Enter The Below Code. \n\n${token} \n\n If You Did not Request A Code,You Can Safely gnore this email  `
        const mailSent = await sendEmail(email,subject,text);

        const timeRemaining = totp.timeRemaining()
        mailSent?
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Sent otp",
            data: timeRemaining,
          })
          : res.status(502).json({
            status: false,
            statusCode: 502,
            message: "Couldn't send OTP",
          });
    }

}
    catch(error){
        console.log("Error from generating otp", error);
    }
}

const verifyOTP = async (req,res,next)=>{
    try{
        const {token , email} = req.body
        const secret = process.env.OTP_SECRET_KEY +email
        const isValid = totp.verify({token : token.toString(),secret})

        if(!isValid)
        return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "Invalid OTP",
            data: { isValid },
          });
          const userFound = await User.findOne({email})

          if(!userFound)
          return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "User does not exist",
          });

          const otpVerificationToken = jwt.sign({email},process.env.OTP_TOKEN_SECRET,{expiresIn : "5m"})

          const timeRemaining = totp.timeRemaining()

          res.header("OTP-VERIFICATION-TOKEN",otpVerificationToken)
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Token is valid",
            data: { isValid, timeRemaining },
          });
    }
    catch(error){
        console.log("Error from verify otp", error);
    }
}

const resetPassword = async(req,res)=>{
    try{
        const otpHeader = req.headers["otp-verification-token"]
        if(!otpHeader)
        return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "No otp verification header",
        });
        const {password, email} = req.body
        jwt.verify(
            otpHeader,process.env.OTP_TOKEN_SECRET,
            async(err,decoded)=>{
                if (err)
          return res.status(403).json({
            status: false,
            statusCode: 403,
            message: "Invalid Token",
            error: err,
          });
          req.users = decoded.userId

          const hashedPassword = await bcrypt.hash(
            password,10
          )
          const user =await User.findOneAndUpdate(
            {email},{password : hashedPassword}
          )

          if (!user)
          return res.status(400).json({
            status: true,
            statusCode: 400,
            message: "Password could not be updated",
            // data: user,
          });
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Password updated successfully",
          // data: user,
        });

            }
        )
    }
    catch (error) {
        console.log("Error from reset otp", error);
        internalServerError(res, error);
      }
}
module.exports = { generateOTP,verifyOTP,resetPassword}