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
  creator: { type: String, required: true },
});

//export model
module.exports = mongoose.model("Property", propertySchema);
