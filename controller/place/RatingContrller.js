const { Place , User } = require("../../models/index")
const { default : mongoose } = require("mongoose")

const addrating = async(req,res)=>{
    try{
        const { placeId ,overallRating} = req.body
        const { userId } = req.users

        if(overallRating <0 || overallRating>5){
            return res.json({message : "Please select rating between 0 to 5 "})
        }
        const userfound = await User.findOne({
            $and: [{
                "rating.userId" : userId,

            },
            {
                _id : placeId
            }
        ]
        })
        if(userfound == null || userfound.length < 1) {
            await Place.findByIdAndUpdate(
                placeId,
                {
                    $push : {
                        rating:
                        {
                            userId : userId

                        },
                    },
                },
                {new : true }
            )
            const countRatings = await Place.findOneAndUpdate(
                {_id : placeId},
                { $inc : { countRating : 1}},
                {new:true}
            )

            let countRatingg = countRatings.countRating
            let oldRating = countRatings.overallRating

            let sub = countRatingg -1 
            let mul = old_rating * sub 
            let add = mul + overallRating
            let new_rating = add /countRatingg

            const updateRating = await Place.findOneAndUpdate(
              {_id:placeId},
              { overallRating:new_rating},
              {new:true}  
            )

            const result = await Place.findByIdAndUpdate(placeId, { overallRating: new_rating },
                { new: true }
              ).select("overallRating");
        
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "added rating successfully",
                data: result,
              });
            } else {
              res.status(400).json({
                status: false,
                statusCode: 400,
                message: "This user has already given rating",
              })

        }

    }
    catch(error){
        console.log("Error from add rating", error);
    }
}
module.exports = { addrating}