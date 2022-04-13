/*
 * [user.js] is a blueprint of the user that we want to store in the database
 */

//import libraries
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//instantiating Schema constant
const Schema = mongoose.Schema;

//user blueprint
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  properties: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Property",
    },
  ],
  //-------------------------FOW----------------------------
  userShares: [{ type: mongoose.Types.ObjectId, required: true, ref: "Share" }],
  //-------------------------FOW----------------------------
});

//add the unique validator to the schema - there is some issue with the mongoose and the validator
//userSchema.plugin(uniqueValidator);

//export model
module.exports = mongoose.model("User", userSchema);
