/*
 * [share.js] is a blueprint of the shares user own from certain property that we want to store in the database
 */

//import libraries
const mongoose = require("mongoose");

//instantiating Schema constant
const Schema = mongoose.Schema;

//user blueprint
const shareSchema = new Schema({
  owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  shareProperty: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Property",
  },
  propertyTitle: { type: String, required: true },
  cost: { type: Number, required: true },
  share: { type: Number, required: true },
  forSale: { type: Boolean, default: false },
});

//export model
module.exports = mongoose.model("Share", shareSchema);
