const {User,Place } = require("../../models/index")

const cloudinary = require("../../utils/cloudinaryConfig")
const { default : mongoose} =require("mongoose")


const addPlace = async(req,res) =>{
    try{let {placName, description,
        overview,
        address,
        phone,
        category,
        location,
        acceptsCreditCard,
        delivery,
        dogFriendly,
        familyFriendly,
        inWalkingDistance,
        outdoorSeating,
        parking,
        wifi, }=req.body

        const {emailId ,userId } = req.users
        const placePic = req.file.path 

        const  cloudinaryResult = await cloudinary.uploader.upload(placePic,{folder:"image"})
        const Place = new Place({
            placePic : {
                public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
            },
            placName,
            userId,
      description,
      overview,
      address,
      phone,
      category,
      location,
      //email,

      acceptsCreditCard,
      delivery,
      dogFriendly,
      familyFriendly,
      inWalkingDistance,
      outdoorSeating,
      parking,
      wifi,



        })
        const result = await place.save()
        if (result)
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Place successfully added",
            data: { result },
          });
          else 
          res.status(400).json({
            status: false,
            statusCode: 400,
            message: "Couldn't create Place",
            data: {},
          });
    }
    catch(error){
        console.log("Error from add place", error);
    }
}

const getParticularPlace = async(req,res) =>{
    try{
        const {placeId,latitude,longitude} = req.body
        const place = await Place.findOne({_id:placeId }).select(
            "placeName placePic description photos review overview rating address phone location"
          );
          await Place.updateOne({_id:placeId},{$inc : {viewCount: 1}}).exec()
          if (!place)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Place does not exist",
      });
const user = await place.findOne({_id:placeId}).select("overallRating")

const data ={

    placeDetails: place,
    overallrating : user.overallrating
}
res.status(200).json({
    status: true,
    statusCode: 200,
    message: "Places fetched",
    data: data,
  });

    }
    catch(error)
    {
        console.log("Error from get place", error);
    }
}

const nearMe = async(req,res) =>{
    try{

        let x = parseFloat(req.query.latitude)
        let y = parseFloat(req,query.longitude)

        const nearPlaces = await Place.aggregate([
            {
                $geoNear :{
                    near :{
                        type: "Point",
                    coordinates :[y,x],
                    },
                    key:"location",
                    maxDistance : parseInt(10000)*1609,
                    distanceField: "dist.calculated",
                    distanceMultiplier: 1 / 1000,
                    spherical: true,

                }
            },
            {
$project : {
    _id : 1,
    "dist.calculated" : 1,
    location : 1,
    placeName: 1,
          placePic: 1,
          description: 1,
          stars: 1,
          overallRating: 1,
          address: 1,


}
            }
        ])
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Near you Places fetched",
            data: nearPlaces,
          });

    }
    catch(error)
    {
        console.log("Error from near you", error);
    }
}

const searchPlace = async(req,res)=>{
    try {
latitude = req.body.latitude 
 longitude = req.body.longitude
 text = req.body.text

 const result = await Place.aggregate([
    {
        $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            key: "location",
            maxDistance: parseInt(100000) * 1609,
            distanceField: "dist.calculated",
            distanceMultiplier: 1 / 1000,
            spherical: true,
        }
    },
    {
        $match :{
            $or:
            [
                {
                    placeName: { $regex: req.body.text, $options: "i" },
                },
                { description: { $regex: req.body.text, $options: "i" } },
                {
                  address: { $regex: req.body.text, $options: "i" },
                },
                {
                  category: { $regex: req.body.text, $options: "i" },
                }
            ]
        }

    }
 ])
 if (result) {
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Places fetched",
      data: result,
    });
  } else {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "no match",
    });
  }
    }
    catch(error)
    {
        console.log("Error from search place", error);
    }
}