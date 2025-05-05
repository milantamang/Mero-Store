const mongoose = require("mongoose");

const offerModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status:{
      type:Boolean,
      default:true
    },
  },
  { timestamps: true }
);

const HomeOffer = mongoose.model("Offer", offerModel);
module.exports = HomeOffer;
