/*
 * [shares-controllers.js] file contain all functions for the shares routes
 */

//import libraries
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

//local imports
const HttpError = require("../models/http-error");
const Property = require("../models/property");
const User = require("../models/user");
const Share = require("../models/share");

//get share by id. Asynchronous task
const getShareById = async (req, res, next) => {
  //get the share by comparing id from url against database
  const shareId = req.params.sid;

  //instantiating new variable with a scope of the method
  let share;

  //try to get share by id from database with an asynchronous method. Catch and display error if fail
  try {
    //get the share from the database
    share = await Share.findById(shareId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a share.",
      500
    );
    return next(error);
  }

  //returns error in case no share was found
  if (!share) {
    const error = new HttpError(
      "Could not find a share for the provided id.",
      404
    );
    return next(error);
  }

  //response to the request. Covert [share] to JavaScript object. {getters: true} removes the underscore from the id
  res.json({ share: share.toObject({ getters: true }) });
};

//Get share by user id
const getSharesByUserId = async (req, res, next) => {
  //get the user id from the url
  const userId = req.params.uid;

  //instantiating new variable with a scope of the method
  let userWithShares;

  //get the given user shares by using pointers from the [userShares] field. Returns error if fail
  try {
    userWithShares = await User.findById(userId).populate("userShares");
  } catch (err) {
    const error = new HttpError(
      "Fetching shares failed, please try again later.",
      500
    );
    return next(error);
  }

  //returns error in case no share was found
  if (!userWithShares || userWithShares.userShares.length === 0) {
    return next(
      new HttpError("Could not find shares for the provided user id.", 404)
    );
  }

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  res.json({
    userShares: userWithShares.userShares.map((share) =>
      share.toObject({ getters: true })
    ),
  });
};

//buy property share
const buyPropertyShare = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get data from the body
  const { share, owner } = req.body;
  //get id from the url
  const shareProperty = req.params.pid;

  //instantiating new object using the blueprint from models
  const createdShare = new Share({
    owner,
    shareProperty,
    share,
  });

  //instantiating new variable with a scope of the method
  let property;

  //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
  try {
    property = await Property.findById(shareProperty);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not retrieve the property data.",
      500
    );
    return next(error);
  }

  //returns error if property variable is empty or there not enough available shares
  if (!property) {
    return next(
      new HttpError("Could not find the property. Please try again.", 404)
    );
  } else if (property.availableShares == 0.0) {
    return next(
      new HttpError(
        "There are not available shares for this property at the moment. Please try again later.",
        422
      )
    );
  } else if (property.availableShares < share) {
    return next(
      new HttpError(
        "Not enough available shares, please choose lower value.",
        422
      )
    );
  }

  //check if the provided user id exists
  let user;
  try {
    user = await User.findById(owner);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not retrieve the user data.", 500);
    return next(error);
  }

  //check if user has been retrieved
  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided id",
      404
    );
    return next(error);
  }

  //diagnostic
  console.log(createdShare); // <----------------------- DELETE ME ! -------------------------------------------

  try {
    //starting session
    const sess = await mongoose.startSession();
    //starting a transaction
    sess.startTransaction();
    //saves the share
    await createdShare.save({ session: sess });
    //deduct bought shares from the availableShares field of property document
    property.availableShares -= share;
    //adding the share id to the property owners array
    property.propertyShares.push(createdShare);
    //saves the property
    await property.save({ session: sess });
    //adding the share to the user shares array
    user.userShares.push(createdShare);
    //saves the user
    await user.save({ session: sess });
    //session commits the transaction if all previous commands has been executed successfully
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Property share purchase failed, please try again.",
      500
    );
    return next(error);
  }

  //response to the request
  res.status(200).json({ share: createdShare });
};

//sell property share
const sellPropertyShare = async (req, res, next) => {
  //get id from the url
  const shareId = req.params.sid;

  //instantiating new variable with a scope of the method
  let share;

  //try to get share by id from database with an asynchronous method. Catch and displays error if it fail
  try {
    share = await Share.findById(shareId).populate("owner shareProperty");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not retrieve your share data.",
      500
    );
    return next(error);
  }

  //check if share exist
  if (!share) {
    const error = new HttpError(
      "Could not find share for the provided id",
      404
    );
    return next(error);
  }

  //diagnostic
  console.log(share); // <------------------------------------- DELETE ME ! ----------------------------------------------

  //try to delete share from database with an asynchronous method. Catch and displays error if it fail
  try {
    //starting new session
    const sess = await mongoose.startSession();
    //starting a transaction
    sess.startTransaction();
    //adding back shares to the property available shares
    share.shareProperty.availableShares += share.share;
    //remove share
    await share.remove({ session: sess });
    //remove share from the property array
    //share.property.owners.pull(share.user);
    share.shareProperty.propertyShares.pull(share);
    //saves the update
    await share.shareProperty.save({ session: sess });
    //remove share from the user array
    share.owner.userShares.pull(share);
    //saves the update
    await share.owner.save({ session: sess });
    //commit the transaction
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not sell your share.",
      500
    );
  }

  //response to the request
  res.status(200).json({ message: "Share sold." });
};

// //update existing property
// const updateProperty = async (req, res, next) => {
//   //check validation results and return error in case is not empty
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your data.", 422)
//     );
//   }

//   //get data from the body
//   const { title, description } = req.body;
//   //get id from the url
//   const propertyId = req.params.pid;

//   //instantiating new variable with a scope of the method
//   let property;

//   //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
//   try {
//     property = await Property.findById(propertyId);
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not update property.",
//       500
//     );
//     return next(error);
//   }

//   //updating details
//   property.title = title;
//   property.description = description;

//   //try to save the newly updated property into the database with asynchronous method. Catch and displays error if it fails
//   try {
//     await property.save();
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not update property",
//       500
//     );
//     return next(error);
//   }

//   //response to the request. Covert [property] to JavaScript object. {getters: true} removes the underscore from the id
//   res.status(200).json({ property: property.toObject({ getters: true }) });
// };

//exporting functions pointers rather than executables
exports.getShareById = getShareById;
exports.getSharesByUserId = getSharesByUserId;
// exports.updateProperty = updateProperty;
exports.buyPropertyShare = buyPropertyShare;
exports.sellPropertyShare = sellPropertyShare;
