const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: {
    public_id: {
      type: String,
      // required: true,
      default:
        "https://res.cloudinary.com/dodityyjl/image/upload/v1670903393/image/hb8o0wr3rr9rompysw9g.jpg",
    },
    url: {
      type: String,
      //required: true,
    },
    // default:
    //   "https://res.cloudinary.com/dodityyjl/image/upload/v1670903393/image/hb8o0wr3rr9rompysw9g.jpg",
  },
  favorite: [
    {
      placeId: { type: mongoose.Schema.Types.ObjectId, ref: "PlaceModel" },
      // placeId: { type: String },
      //{ type: Boolean, default: false },
    },
  ],
  feedbackText: [
    {
      type: String,
    },
  ],
  refreshToken: { type: String },
});

const userModel = mongoose.model("userModel",userModel)
module.exports = userModel