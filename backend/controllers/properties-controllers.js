/*
 * [properties-controllers.js] file contain all functions for the properties routes
 */

//import libraries
//const uuid = require("uuid"); //generates IDs -----> D E L E T E   M E   A T   S O M E   P O I N T ! <-----
const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

//local imports
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Property = require("../models/property");
const User = require("../models/user");
const Share = require("../models/share");


//get all properties
const getAllProperties = async (req, res, next) => {

  //instantiating new variable with a scope of the method
  let properties;
  // ALTERNATIVE: let properties;

  //get the properties by comparing user id from url against database creator field. Returns error if fail
  try {
    properties = await Property.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching properties failed, please try again later.",
      500
    );
    return next(error);
  }

  //returns error in case no properties was found
  if (!properties || properties.length === 0) {
    return next(new HttpError("Could not find any properties", 404));
  }

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  // res.json({
  //   properties: userWithProperties.properties.map((property) =>
  //     property.toObject({ getters: true })
  //   ),
  // });
  res.json({
    properties: properties.map((property) =>
      property.toObject({ getters: true })
    ),
  });
};

//get property by id. Asynchronous task
const getPropertyById = async (req, res, next) => {
  //get the property by comparing id from url against database
  const propertyId = req.params.pid;

  //instantiating new variable with a scope of the method
  let property;

  //try to get property by id from database with an asynchronous method. Catch and display error if fail
  try {
    //get the property from the database
    property = await Property.findById(propertyId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a property.",
      500
    );
    return next(error);
  }

  //returns error in case no property was found
  if (!property) {
    const error = new HttpError(
      "Could not find a property for the provided id.",
      404
    );
    return next(error);
  }

  //response to the request. Covert [property] to JavaScript object. {getters: true} removes the underscore from the id
  res.json({ property: property.toObject({ getters: true }) });
};

//Get property by user id
const getPropertiesByUserId = async (req, res, next) => {
  //get the user id from the url
  const userId = req.params.uid;

  //instantiating new variable with a scope of the method
  let userWithProperties;
  // ALTERNATIVE: let properties;

  //get the properties by comparing user id from url against database creator field. Returns error if fail
  try {
    userWithProperties = await User.findById(userId).populate("properties");
    // ALTERNATIVE: properties = await Property.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching properties failed, please try again later.",
      500
    );
    return next(error);
  }

  //returns error in case no properties was found
  if (!userWithProperties || userWithProperties.properties.length === 0) {
    // ALTERNATIVE: if (!properties || properties.length === 0) {
    return next(
      new HttpError("Could not find properties for the provided user id.", 404)
    );
  }

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  res.json({
    properties: userWithProperties.properties.map((property) =>
      property.toObject({ getters: true })
    ),
  });
  //    ALTERNATIVE: res.json({
  //     properties: properties.map((property) =>
  //     property.toObject({ getters: true })
  //   ),
  // });
};

//Get property by share id
const getPropertyByShareId = async (req, res, next) => {
  //get the share id from the url
  const shareId = req.params.sid;

  //instantiating new variable with a scope of the method
  let tempShareProperty;
  // ALTERNATIVE: let properties;


  //get the property by comparing share id from url against database shareProperty field. Returns error if fail
  try {
    tempShareProperty = await Share.findById(shareId).populate("shareProperty");
    // ALTERNATIVE: properties = await Property.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching property failed, please try again later.",
      500
    );
    return next(error);
  }

  //returns error in case no property was found
  if (!tempShareProperty || tempShareProperty.shareProperty.length === 0) {
    // ALTERNATIVE: if (!properties || properties.length === 0) {
    return next(
      new HttpError("Could not find property for the provided share id.", 404)
    );
  }

  //response to the request. Covert [property] to JavaScript object. {getters: true} removes the underscore from the id
  res.json({
    property: tempShareProperty.shareProperty.toObject({ getters: true }),
  });

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  // res.json({
  //   properties: tempShareProperty.properties.map((property) =>
  //     property.toObject({ getters: true })
  //   ),
  // });
  //    ALTERNATIVE: res.json({
  //     properties: properties.map((property) =>
  //     property.toObject({ getters: true })
  //   ),
  // });
};

//create new property
const createProperty = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //object destructuring
  const { title, description, address, price } = req.body;

  //retrieving the userId from the authorisation token instead the body of the request, as it is more secure
  const creator = req.userData.userId;

  //convert address to coordinates
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  //instantiating new object using the blueprint from models
  const createdProperty = new Property({
    title, //When same name: (title == title: title)
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
    propertyShares: [],
    price,
    availableShares: 100,
  });

  //console.log(createdProperty); // <----------------------- DELETE ME ! --------------------------

  //check if the user id for creator exists
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  //check if user has been retrieved
  if (!user) {
    const error = new HttpError(
      "Could not find user with the provided id",
      404
    );
    return next(error);
  }

  console.log(user);

  //try to add new property to the database with the async method [save()]. Catch and display error if fail
  // NOTE: if we dont have collection, will have to created manually !!!
  try {
    //starting session
    const sess = await mongoose.startSession();
    //starting a transaction
    sess.startTransaction();
    //saves the property
    await createdProperty.save({ session: sess });
    //adding the property id to the user
    user.properties.push(createdProperty);
    //saves the user
    await user.save({ session: sess });
    //session commits the transaction if all previous commands has been executed successfully
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating new property failed, please try again.",
      500
    );
    console.log("hello", error);
    return next(error);
  }

  //response to the request. In this case {property} == {property: property}
  res.status(201).json({ property: createdProperty });
};

//update existing property
const updateProperty = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get data from the body
  const { title, description } = req.body;
  //get id from the url
  const propertyId = req.params.pid;

  //instantiating new variable with a scope of the method
  let property;

  //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
  try {
    property = await Property.findById(propertyId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update property.",
      500
    );
    return next(error);
  }

  //checking if the creator user has sent the request
  if (property.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "User not authorised to amend this property.",
      401
    );
    return next(error);
  }

  //updating object
  property.title = title;
  property.description = description;

  //try to save the newly updated property into the database with asynchronous method. Catch and displays error if it fails
  try {
    await property.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update property",
      500
    );
    return next(error);
  }

  //response to the request. Covert [property] to JavaScript object. {getters: true} removes the underscore from the id
  res.status(200).json({ property: property.toObject({ getters: true }) });
};

//delete existing property
const deleteProperty = async (req, res, next) => {
  //get id from the url
  const propertyId = req.params.pid;

  //instantiating new variable with a scope of the method
  let property;

  //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
  try {
    property = await Property.findById(propertyId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete property.",
      500
    );
    return next(error);
  }

  //check if property has been retrieved
  if (!property) {
    const error = new HttpError(
      "Could not find property for the provided id",
      404
    );
    return next(error);
  }

  //checking if the creator user has sent the request
  if (property.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "User not authorised to delete this property.",
      401
    );
    return next(error);
  }

  //get the image path
  const imagePath = property.image;

  //try to delete property from database with an asynchronous method. Catch and displays error if it fail
  try {
    //starting new session
    const sess = await mongoose.startSession();
    //starting a transaction
    sess.startTransaction();
    //remove property
    await property.remove({ session: sess });
    //remove property from the user array
    property.creator.properties.pull(property);
    //saves the update
    await property.creator.save({ session: sess });
    //commit the transaction
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete property.",
      500
    );
  }

  //delete image if the execution reach this point
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  //response to the request
  res.status(200).json({ message: "Property deleted." });
};

//exporting functions pointers rather than executables
exports.getAllProperties = getAllProperties;
exports.getPropertyById = getPropertyById;
exports.getPropertiesByUserId = getPropertiesByUserId;
exports.getPropertyByShareId = getPropertyByShareId;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;