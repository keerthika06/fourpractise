const jwt = require("jsonwebtoken")

const checkUserIsLoggedIn = (req,res,next) =>{
    const authHeader = req.header["Authorization"]

    if(!authHeader)
    return next()


    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=> {
        if(err)
        return res.srtatus(403).json({
            status: false,
            statusCode: 403,
            message: "User Token is expired / Invalid token",
          }); //invalid token

          if(!decoded.userId || decoded.email)
          return res.status(403).json({
            status: false,
            statusCode: 403,
            message: "Token there but Invalid token user id not found",
          }); //invalid token
          req.users = { userId: decoded.userId,email:decoded.email}
    next()
    })

}
module.exports = checkUserIsLoggedIn