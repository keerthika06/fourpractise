const {User } = require("../models/index")
const bcrypt = require("bcrypt")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const {mongoose} = require("mongoose")
const cloudinary = require("../utils/cloudinaryConfig")
const {sendEmail} = require()

const register = async ( req,res) =>{
    if(!req.body){
        res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body not found" });
    }
    const { email,phone, name ,password } = req.body

    const userfound = await User.findOne({email})
    if(userfound)
    return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "User with this email already present",
      });

      bcrypt.hash( password,10,async(err,hash)=>{

        if(err)
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: "could not hash the password",
      })
      hashedPassword = hash

      try{
        const user = new User({
            email,phone,name,password:hashedPassword
        })
        const result = await user.save()
        if( result){
            const accessToken = jwt.sign(
                {userId:result._id,email:result.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : "1h"}
            )
            const refreshToken = jwt.sign(
                {userId:result._id,email:result.email},
                process.env.REFRESH_TOKEN_SECRET,
                {expireIn:"1d"}

            )
            await User.findOneAndUpdate(
                {
                  _id : result._id  
                },
                {refreshToken : refreshToken}
            )

            res.header("Refresh-token",refreshToken)

            res.header("Authorization","Bearer "+accessToken)
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: " User succesfully registered",
              });
            } else
              res.status(500).json({
                status: false,
                statusCode: 200,
                message: "couldnt register user",
                data: {},
              });
        }

      
      catch(error) {
        console.log("error from register", error);
        internalServerError(res, error);
      }
    })


}