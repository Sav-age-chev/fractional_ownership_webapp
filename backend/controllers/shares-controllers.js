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
    shares: userWithShares.userShares.map((share) =>
      share.toObject({ getters: true })
    ),
  });
};

//Get share by property id
const getSharesByPropertyId = async (req, res, next) => {
  //get the property id from the url
  const propertyId = req.params.pid;

  //instantiating new variable with a scope of the method
  let propertyWithShares;

  //get the given property shares by using pointers from the [propertyShares] field. Returns error if fail
  try {
    // propertyWithShares = await Property.findById(propertyId).populate(
    //   "propertyShares"
    // );
    propertyWithShares = await Property.findById(propertyId).populate({
      path: "propertyShares",
      match: { forSale: true },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching shares failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log("The answer you seek: " + propertyWithShares); // <------- diagnostic --------- PLEASE DELETE ME ! ----------

  //returns error in case no share was found
  // if (!propertyWithShares || propertyWithShares.propertyShares.length === 0) {
  //   return next(
  //     new HttpError("Could not find shares for the provided property id.", 404)
  //   );
  // }

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  res.json({
    shares: propertyWithShares.propertyShares.map((share) =>
      share.toObject({ getters: true })
    ),
  });
};

//buy property share
const buyPropertyShare = async (req, res, next) => {

  //object destructuring
  const { shareProperty, propertyTitle, cost, share } = req.body; 

  //get userId from the authorisation token as it is more secure
  const owner = req.userData.userId;

  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get id from the url
  const propertyId = req.params.pid;

  //instantiating new variable with a scope of the method
  let property;

  //instantiating new object using the blueprint from models
  const createdShare = new Share({
    owner, //owner == owner: owner
    shareProperty,
    propertyTitle,
    sellPrice: cost,
    cost,
    share,
  });

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
    const error = new HttpError(
      "Something went wrong, could not retrieve the user data.",
      500
    );
    return next(error);
  }

  //check if user has been retrieved
  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 404);
    return next(error);
  }

  //checking if the creator user has sent the request
  if (user.id.toString() !== req.userData.userId) {
    const error = new HttpError(
      "User not authorised to purchase this share.",
      401
    );
    return next(error);
  }

  //try to create new share in the database with the async method [save()]. Catch and display error if fail
  // NOTE: if dont have collection, will have to be created manually !!
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

//update existing share
const updateShare = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get data from the body
  const { sellPrice, forSale } = req.body;
  //get id from the url
  const shareId = req.params.sid;


  //instantiating new variable with a scope of the method
  let share;

  try {
    share = await Share.findById(shareId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update your share of the property.",
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

  //checking if the creator user has sent the request
  if (share.owner.toString() !== req.userData.userId) {
    const error = new HttpError(
      "User not authorised to amend this share.",
      401
    );
    return next(error);
  }

  //updating details
  if (forSale) {
    share.forSale = !share.forSale;
    share.sellPrice = sellPrice;
  }

  //try to amend share in the database with the async method [save()]. Catch and display error if fail
  try {
    await share.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update share",
      500
    );
    return next(error);
  }

  //response to the request. Convert [share] to JavaScript object. {getters: true} removes the underscore from the id
  res.status(200).json({ share: share.toObject({ getters: true }) });
};

//update existing share
const updateSharesOwner = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get data from the body
  const { sellPrice } = req.body; //owner
  //retrieving the user id from the token once decoded
  const owner = req.userData.userId;
  //get id from the url
  const shareId = req.params.sid;

  //instantiating new variable with a scope of the method
  let share;

  try {
    share = await Share.findById(shareId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update your share of the property.",
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

  //instantiating new variable with a scope of the method
  let user;

  //retrieving the new user
  try {
    user = await User.findById(owner);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not retrieve the user data.",
      500
    );
    return next(error);
  }

  //check if new user has been retrieved
  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 404);
    return next(error);
  }

  //checking if the creator user has sent the request
  if (user.id.toString() !== req.userData.userId.toString()) {
    const error = new HttpError(
      "User not authorised to purchase this share.",
      401
    );
    return next(error);
  }

  //updating details
  share.forSale = !share.forSale;
  share.cost = sellPrice;

  //try to amend share in the database with the async method [save()]. Catch and display error if fail
  try {
    //starting new session
    const sess = await mongoose.startSession();
    //starting a transaction
    sess.startTransaction();
    //execute the following if share change ownership
    console.log("Hello from condition two!"); // <--- DELETE ME ! ---
    //remove share from the old user array
    share.owner.userShares.pull(share);
    //saves the update
    await share.owner.save({ session: sess });
    //add share to the new user array
    user.userShares.push(share);
    //saves the update
    await user.save();
    //update the owner field in share
    share.owner = user;
    //save share
    await share.save();
    //commit the transaction
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update share",
      500
    );
    return next(error);
  }
};

//exporting functions pointers rather than executables
exports.getShareById = getShareById;
exports.getSharesByUserId = getSharesByUserId;
exports.getSharesByPropertyId = getSharesByPropertyId;
exports.updateShare = updateShare;
exports.buyPropertyShare = buyPropertyShare;
exports.sellPropertyShare = sellPropertyShare;
exports.updateSharesOwner = updateSharesOwner;
