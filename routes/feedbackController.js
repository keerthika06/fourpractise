const {User} = require("../models/placeSchema")

const {default : mongoose} = require("mongoose")

const addFeedBackAndUpdateTheSame = async(req,res) =>{
    try{
        if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

        const {userId} = req.users

        const feedbackText = req.body

        const user = await User.findByIdAndUpdate(userId, feedbackText)
        const result = await user.save()
        
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Added feedback successfully",
            //data: result,
          });



    }
    catch(error){
        console.log("Error, couldn't add feedback", error);
    }
}

const addFeedback = async(req,res) =>{
    try{
        if(!req.body)
        return res
          .status(400)
          .json({ status: false, statusCode: 400, message: "body is not found" })

          const {userId} = req.users
          const { feedbackText} = req.body
          const result = await User.findByIdAndUpdate(
            {_id : userId},
            {$push:{feedbackText}},
            {new:true}
          )
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Added favorite successfully",
            data: result,
          });
    }
    catch(error){
        console.log("Error, couldn't add favorite", error);
    }
}

module.exports = { addFeedback, addFeedBackAndUpdateTheSame}