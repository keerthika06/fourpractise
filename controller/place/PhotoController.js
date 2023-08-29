const {Place , User } = require("../../models/index")
const cloudinary = require("../../config/databaseconnection")
const {default : mongoose, trusted } = require("mongoose")


const addPhoto = async(req,res) =>
{
    try{
        if(!req.body)
        return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

        const {placeId } = req.body
        const {userId} = req.users
        const picture = req.file.path

        const cloudinaryResult = await cloudinary.uploader.upload(picture, {
            folder :"image"
        })

        const obj = {
            placeId,
            userId ,
            picture : {
                public_id : cloudinaryResult.public_id,
                url : cloudinaryResult.secure_url
            },
            dates : Date.now()
        }

        const result = await Place.findByIdAndUpdate(
            {_id : placeId},
            {$push : { photos:obj}},
            {new:true }
        )
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Added photo successfully",
            data: result,
          });



    }
    catch(error){
        console.log("Error, couldn't add photo", error);
    }

}

const getPhoto = async(req,res) =>{
    try{
        if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

        const { placeId } = req.query
        const photo = await Place.findOne({_id:placeId }).select("photos")

        if (photos){
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Photos fetched",
                data: photo,
                // data: result.flat(),
              });
        }
        return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "No photos are added to this place.",
          });
    }
    catch (error) {
        console.log("Error from get photos", error);
        internalServerError(res, error);
      }
}

const uploadMultiplePhotos = async(req,res)=>{
    try{
        const {userId} = req.users
        const {placeId} = req.body
        const urls = []
        const files = req.files

        const cloudinaryImageUpload = async(file) =>{
            return new Promise((resolve) =>{
                cloudinary.uploader.upload(file, (err,res)=>{
                    if(err) return new res.status(500).send("upload image error")
                    resolve({
                res: res.secure_url
            })
                })
            })
        }
        for (const file of files){
            const { path } =files
            const newPath = await cloudinaryImageUpload(path , {
                folder : "image"
            })
            urls.push(newPath
                )
        }
        const user = await User.fidById({_id : userId})

        const obj = {
            picture: {
                url : urls.map((url)=> url.res)
            },
            userId,
            dates : Date.now(),
                name : user.name 
        }
        const result = await Place.findByIdAndUpdate(
            { _id : placeId},
            {$push :{photos : obj}},
        {new : true}
        )

        if(result)
        res.status(200).json({
            status: true,
            statusCode: 200,
            messGE: "IMAGE UPLOADED",
            data: result,
          });

          else
          res.status(400).json({
            status: true,
            statusCode: 400,
            messGE: "Unable to upload images",
          });

    }
    catch(error)
    {
        console.log("Error, couldn't add photo", error);
    }
}

module.exports = {
    addPhoto, getPhoto, uploadMultiplePhotos
}