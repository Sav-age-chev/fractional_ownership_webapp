/*
 * [property.js] is a blueprint of the property that we want to store in the database
 */

//import libraries
const mongoose = require("mongoose");

//instantiating Schema constant
const Schema = mongoose.Schema;

//property blueprint
const propertySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  //-------------------------FOW----------------------------
  propertyShares: [{ type: mongoose.Types.ObjectId, required: true, ref: "Share" }],
  //owners: [{ type: mongoose.Types.ObjectId, required: false, ref: "Share" }],
  price: { type: Number, required: true },
  availableShares: { type: Number, required: true },
  approved: { type: Boolean, default: true },
  //-------------------------FOW----------------------------
});

//export model
module.exports = mongoose.model("Property", propertySchema);
