const {User,Place } = require("../../models/index")
const cloudinary = require("../../utils/cloudinaryConfig")
const { default : mongoose } = require("mongoose")

const findFilter = async(req,res) =>{
    try {
        latitude = req.body.latitude;
        longitude = req.body.longitude;
        radius = req.body.radius;
        stars = req.body.stars;
        acceptsCreditCard = req.body.acceptsCreditCard;
        delivery = req.body.delivery;
        dogFriendly = req.body.dogFriendly;
        familyFriendly = req.body.familyFriendly;
        inWalkingDistance = req.body.inWalkingDistance;
        outdoorSeating = req.body.outdoorSeating;
        parking = req.body.parking;
        wifi = req.body.wifi;
        sortBy = req.body.sortBy;
        text = req.body.text;

        if(!radius) radius = 2000
        if (!stars) stars = 4
        if (sortBy =="distance")
        sortBy = "distance.calculated"
        else if (sortBy == "popular ")
        sortBy = "viewCount"
        else sortBy = "rating"

        const matchlength =
        acceptsCreditCard ||
        delivery ||
        dogFriendly ||
        familyFriendly ||
        inWalkingDistance ||
        outdoorSeating ||
        parking ||
        wifi;

        if(matchlength) {
            match = {
                $and : [
                    { acceptsCreditCard:acceptsCreditCard},
                    {delivery :delivery},
                    {dogFriendly:dogFriendly},
                    {
                        familyFriendly: familyFriendly,
                      },
                      {
                        inWalkingDistance: inWalkingDistance,
                      },
                      {
                        outdoorSeating: outdoorSeating,
                      },
                      {
                        parking: parking,
                      },
                      {
                        wifi: wifi,
                      },
                ]
            }

            match = JSON.parse(JSON.stringify(match))
        }

        else{
            match = {
            $or: [
                {
                  acceptsCreditCard: true,
                },
                {
                  acceptsCreditCard: false,
                },
              ],
            }
        }
        const filter = await Place.aggregate([
            {
                $geoNear :{
                    near : {
                        type:"Point",
                        coordinates : [parseFloat(longitude), parseFloat(latitude)]

                    },
                    key : "location" ,
                    maxDistance: parseInt(100000) * 1609,
                    distanceField: "dist.calculated",
                    distanceMultiplier: 1 / 1000,
                    spherical: true,

                }

                

            },
            {
              $match : { $and : [{stars :{$lte : stars}}]},
            },
            {
              $match : match,

            },
            {
              $match : {
                $or : [
                  {
                    PlaceName : { $regex : req.body.text , $options : "i"},
                  },
                  {
                    description: { $regex: req.body.text, $options: "i" },

                  },
                  {
                    address: { $regex: req.body.text, $options: "i" },

                  },
                  {
                    category: { $regex: req.body.text, $options: "i" },

                  }
                ]
              }

            }
        ]).sort(sortBy)
        res.send(filter)



        }
    
catch(error)
{
  console.log(error);
}
}
module.exports = { findFilter };