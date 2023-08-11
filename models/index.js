const PlaceModel = require("./placeSchema")
const userModel = require("./userSchema")

module.exports = { 
    User : userModel,
    Place : PlaceModel
}