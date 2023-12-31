const mongoose = require("mongoose")

const PlaceSchema = new mongoose.schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      placeName: { type: String },
      placePic: {
        public_id: {
          type: String,
          // required: true,
        },
        url: {
          type: String,
          //required: true,
        },
      },
      rating: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
          // rate: {
          //   type: Number,
          //   default: 0,
          // },
        },
      ],
      overallRating: { type: Number, default: 0 },
      countRating: { type: Number, default: 0 },
    
      //  enum: [0, 1, 2, 3, 4, 5], default: 0 },
      description: { type: String },
      address: { type: String },
      stars: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1,
      },
      phone: { type: String },
      photos: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
          },
    
          picture: {
            public_id: {
              type: String,
              // required: true,
            },
            url: [],
          },
    
          dates: { type: Date },
        },
      ],
      viewCount: {
        type: Number,
        default: 0,
      },
      overview: { type: String },
      review: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
          },
          reviewText: { type: String, required: true },
          date: { type: Date, required: true },
          reviewPic: [
            {
              // public_id: {
              //   type: String,
              //   // required: true,
              // },
              url: [],
            },
          ],
        },
      ],
      category: {
        type: String,
        enum: ["Resturant", "Coffee", "Shopping", "Attraction", "Services"],
        required: true,
      },
      location: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    
      acceptsCreditCard: {
        type: Boolean,
        default: false,
      },
      delivery: {
        type: Boolean,
        default: false,
      },
      dogFriendly: {
        type: Boolean,
        default: false,
      },
      familyFriendly: {
        type: Boolean,
        default: false,
      },
      inWalkingDistance: {
        type: Boolean,
        default: false,
      },
      outdoorSeating: {
        type: Boolean,
        default: false,
      },
      parking: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: false,
      },



})
PlaceSchema.index({location: "2dsphere"})
const PlaceModel = mongoose.model("placeModel",PlaceModel)
module.exports = PlaceSchema