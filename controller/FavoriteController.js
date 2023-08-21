const {User} = require("../models/index")
const { Place } = require("../models/index")



const { default :mongoose} = require("mongoose")
//const {mongoose} = require("mongoose")
//const mongoose = require("mongoose")
//export default mongoose = ()=>{}
//export  mongoose = ()=>{}

const addFavorite = async(req,res)=>{
    try{
        if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
        const {placeId} = req.body
        const {userId} = req.users

        const ifFavorite =await User.findOne({ $and : [{"favorite.placeId":placeId},{_id:userId}]})

        const Placedetails = await Place.findOne({placeId}).select("placeName placePic descriprtion rating placeLatlong")
        if(!ifFavorite)
        {
            const result = await User.findByIdAndUpdate(
                userId,
                {$push : { favorite: { placeId : placeId}}},
                {new:true}
            )

            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Added favorite successfully",
                data: result,
              });
        }
        else{
            const result = await User.findByIdAndUpdate(
                userId,
                {$pull : { favorite : { placeId : placeId}}},
                {new : true}
            )
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Removed favorite successfully",
                data: result,
              });

        }
    }
    catch(error)
    {
        console.log("Error, couldn't add favorite", error);
    }
}
