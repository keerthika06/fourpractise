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
const getFavorite = async(req,res)=>
{
    try{
        const {userId} = req.users
        const  {searchParams } = req.query
        let x = parseFloat(req.query.latitude);
        let y = parseFloat(req.query.longitude)

        if(searchParams=="" || !searchParams)
        {
            const favorites = await User.findOne({_id:userId}).select("favorite")
            const favoritePlaceOfThatUser = favorites.favorite.map((e)=>{
            return e.placeId
            })
            const filter =  await Place.aggregate([
                {
                    $geoNear :{
                        near:{
                            type:"Point",
                            coordinates:[parseFloat(y), parseFloat(x)],

                        },
                        key:location,
                        maxDistance: parseInt(100000) * 1609,
                        distanceField: "dist.calculated",
                        distanceMultiplier: 1 / 1000,
                        spherical: true,

                    },
                },
                {
                
                    $match: { _id: { $in: favouritePlaceIdsOfThatUser } },
                },
                {
                    $project:{
                        _id: 1,
                        "dist.calculated":1,
                        placeName: 1,
                        placePic: 1,
                        description: 1,
                        stars: 1,
                        overallRating: 1,
                        address: 1,
                    }
                }
            ])
        
        res.send(filter)
        }
        else{
            const favorites = await User.findOne({_id:userId}).select(favorite)
            const favoritePlaceOfThatUser = favorites.favorite.map((e)=>{
                return e.placeId
            })

            const filter = await Place.aggregate([
                {
                    $geoNear:{
                        near :{
                            type :"Point",
                            coordinates: [parseFloat(y), parseFloat(x)],
                        },
                        key: "location",
                        maxDistance: parseInt(100000) * 1609,
                        distanceField: "dist.calculated",
                        distanceMultiplier: 1 / 1000,
                        spherical: true,
                    },
                },
                {
                    $match:{
                        _id :{$in : favoritePlaceOfThatUser}
                    },

                },
                {
                    $match: {
                        $or :[
                            { placeName : {$regex : searchParams,$options : "i"},},
                            { description : { $regex : searchParams, $options : "i"}},
                            { address : { $regex : searchParams, $options : "i"}},
                            { category : { $regex : searchParams, $options : "i"}},

                        ]
                    }
                },
                {
                    $project : {
                        _id: 1,
                        "dist.calculated": 1,
            
                        placeName: 1,
                        placePic: 1,
                        description: 1,
                        stars: 1,
                        overallRating: 1,
                        address: 1,
                    }
                }
            ])
            res.send(filter)

        }

    }
    catch(error)
    {
        console.log(error);
    }
}

const favoriteFilter = async(req,res) =>{
    try{
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
        const {userId} = req.users


        if(!radius) radius = 2000
        if(!stars) stars = 4
        if(sortBy == "distance") sortBy = "distance.calculated"
        else if (sortBy =="popular") sortBy = "viewCount"
        else sortBy = "rating"


        const matchlength = acceptsCreditCard || delivery || dogFriendly || familyFriendly || inWalkingDistance || outdoorSeating||parking || wifi

        if(matchlength) {
            match = {
                $and : [
                    {
                        acceptsCreditCard : acceptsCreditCard
                    },
                    {
                        delivery : delivery
                    },
                    {
                        dogFriendly: dogFriendly
                    },
                    {
                        familyFriendly : familyFriendly
                    },
                    {
                        inWalkingDistance:inWalkingDistance
                    },
                    {
                        outdoorSeating: outdoorSeating
                    },
                    {
                        parking :parking
                    },
                    {
                        wifi :wifi
                    }
                ]
            }
            match = JSON.parse(JSON.stringify(match))
        }
        else{
            match = {
                $or : [
                    {
                        acceptsCreditCard :true
                    },
                    {
                        acceptsCreditCard: false
                    }
                ]
            }
        }

        const favorites = await User.findOne({_id :userId }).select("favorite")
        const favoritePlaceOfThatUser = favorites.favorite.map((e)=>{
            return e.placeId
        })
        const filter = await Place.aggregate([
            {
                $geoNear : {
                    near : {
                        type : "Point",
                        coordinates : [parseFloat(longitude),parseFloat(latitude)]
                    },
                    key:"location",
                    maxDistance: parseInt(100000) * 1609,
                    distanceField: "dist.calculated",
                    distanceMultiplier: 1 / 1000,
                    spherical: true,
                }
            },
            {
                $match : { _id :{$in : favoritePlaceOfThatUser}}

            },
            {
                $match :{$and: [{stars  :{$lte :stars}}]}
            },
            {
                $match :match
            },
            {
                $match :{
                    $or:[
                        {
                            placeName : {regex : req.body.text , $options : "i"},
                        },
                        { description : { $regex : req.body.text, $options : "i"},},
                        {address: { $regex: req.body.text, $options: "i" },},
                        { category :{$regex : req.body.text , $options : "i"}}
                    
                    ]
                }
            }
        ])

        res.send(filter)




    }
    catch(error)
    {
console.log(error)
    }
}

module.exports = {
    addFavorite,
    getFavorite,
    favoriteFilter
}