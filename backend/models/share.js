//---------------------------------FOW--------------------------------------

/*
 * [share.js] is a blueprint of the shares user own from certain property that we want to store in the database
 */

//import libraries
const mongoose = require("mongoose");

//instantiating Schema constant
const Schema = mongoose.Schema;

//user blueprint
const shareSchema = new Schema({
  owners: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  properties: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Property",
  },
  share: { type: Number, required: true },
});

//export model
module.exports = mongoose.model("Share", userSchema);

//---------------------------------FOW--------------------------------------
