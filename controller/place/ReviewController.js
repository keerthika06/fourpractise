const {Place,User } = require("../../models/index")
const cloudinary = require("../../utils/cloudinaryConfig")
const { dfault : mongoose } = require("mongoose" )

const addReview = async(req,res) =>{
    try{
        const {placeId ,reviewText } = req.body
        const {userId } = req.users
        const reviewPic = req.file.path

        const cloudinaryResult = await cloudinary.uploader.upload(reviewPic,{
            folder:"image"})

            const obj = { userId,
                reviewPic :{
                    public_id: cloudinaryResult.public_id,
                    url: cloudinaryResult.secure_url,
                },
                reviewText,
                date : Date.now()
            
            }
            const result  = await Place.findByIdAndUpdate(
                {_id : placeId},
                {$push : { review : obj }},
                {new:true}
            )
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Added review successfully",
                data: result,
              });



    }
    catch(error)
    {
        console.log("Error, couldn't add ground", error);
    }
}

const addReviewByMultipleImages = async(req,res)=>{
    try{
const {userId } = req.users
const {placeId,reviewTexxt} = req.body
const reviewPic = req.files
const userfound = await Place.find({$and :[{"review.userId" : userId},{_id:placeId}]})


if(userfound.length ==""){
    const user = await User.findById({_id:userId})
    const urls=[]
    let obj
    if(reviewPic)
    {
        const files = req.files
        const cloudinaryImageUpload = async(file) =>{
            return new Promise((resolve)=>{
                cloudinary.uploader.upload(file, (err, res) => {
                if(err)
                return res.status(500).send("upload image error")
            resolve({res:res.secure_url})
            })
        })
    }
    for(const file of files)
    {
        const {path} = file

        const newPath = await cloudinaryImageUpload(path,{folder : "image"})
        urls.push(newPath)
    }
    const user = await user.findById({_id : userId})
    obj = {
        userId ,
        reviewPic :{
            url:urls.map((url)=> url.res)
        },
        reviewText,
    date :Date.now
    }

}


const result = await Place.findByIdAndUpdate(
    {_id:placeId},
    {$push : {review:obj}}
)

const data = await Place.findByIdAndUpdate({
    _id:placeId},
    {$push:{
        photos:{
            userid :userId,
            picture:{
                urls:urls.map((url)=>url.res)
            }
        }
    }})

}
}
    catch(error)
    {

    }
}