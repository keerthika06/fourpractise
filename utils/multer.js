const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({})

const fileFilter = (req,file , cb) =>{
    const acceptableExtentions = [".png",".jpg",".jpeg"]
    if(!acceptableExtentions.includes(path.extname(file.originalname))) {
        return cb("PLease upload only image of jpg jpeg or png format")
    }
    cb(null,true)

}
module.exports = multer({
    storage : storage,
    fileFilter : fileFilter
})