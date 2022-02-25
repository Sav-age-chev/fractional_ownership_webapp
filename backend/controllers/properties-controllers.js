/*
 * [properties-controllers.js] file contain all functions for the properties routes
 */

//import libraries
//const uuid = require("uuid"); //generates IDs -----> D E L E T E   M E   A T   S O M E   P O I N T ! <-----
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

//local imports
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Property = require("../models/property");
const User = require("../models/user");
//--------------------FOW-------------------------
// const Share = require("../models/share");
//--------------------FOW-------------------------

//--------------------FOW-------------------------
// //get all properties
// const getProperties = async (req, res, next) => {
//   //instantiating new variable with scope of the object
//   let properties;
//   //fetching all properties excluding their [creator] field. Return error if method fails
//   try {
//     properties = await Property.find({}, "-creator");
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, please try again later",
//       404
//     );
//     return next(error);
//   }
//   //as the return is an array need to use map to convert to JavaScript objects
//   res.json({
//     properties: properties.map((property) => property.toObject({ getters: true })),
//   });
// };
//--------------------FOW-------------------------

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
  const { title, description, address, creator, price, availableShares } =
    req.body;

  //convert address to coordinates
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  console.log(creator); // <----------------------- DELETE ME ! --------------------------

  //instantiating new object using the blueprint from models
  const createdProperty = new Property({
    title, //When same name: (title == title: title)
    description,
    address,
    location: coordinates,
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260/",
    creator,
    //--------------------FOW-------------------------
    propertyShares: [],
    price,
    availableShares,
    //--------------------FOW-------------------------
  });

  console.log(createdProperty); // <----------------------- DELETE ME ! --------------------------

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

  //try to add new property to the database with the async method [save()]. Catch and display error if fail
  // NOTE: if we dont have collection [properties], will have to created manually !!!
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
    const error = new HttpError(
      "Creating new property failed, please try again.",
      500
    );
    return next(error);
  }

  //response to the request. In this case {property} == {property: property}
  res.status(201).json({ property: createdProperty });
};

//----------------------------------------------------------------FOW----------------------------------------------------------------

// //buy property share
// const buyPropertyShare = async (req, res, next) => {
//   //check validation results and return error in case is not empty
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your data.", 422)
//     );
//   }

//   //get data from the body
//   const { share } = req.body;
//   //get id from the url
//   const propertyId = req.params.pid;
//   const userId = req.params.uid;

//   console.log(propertyId); // <----------------------- DELETE ME ! --------------------------
//   //console.log(userId); // <----------------------- DELETE ME ! --------------------------

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

//   //returns error if property variable is empty or there not enough available shares
//   if (!property) {
//     return next(
//       new HttpError("Could not find the property. Please try again.", 404)
//     );
//   } else if (property.availableShares == 0.0) {
//     return next(
//       new HttpError(
//         "There are not available shares for this property at the moment. Please try again later.",
//         422
//       )
//     );
//   } else if (property.availableShares < share) {
//     return next(
//       new HttpError(
//         "Not enough available shares, please choose lower value.",
//         422
//       )
//     );
//   } //else {
//   // property.availableShares -= share;             //TODO: move to the transaction
//   //}

//   //check if the user id for the provided id exists
//   let user;
//   try {
//     user = await User.findById(userId);
//   } catch (err) {
//     const error = new HttpError("Buying shares failed, please try again.", 500);
//     return next(error);
//   }

//   //check if user has been retrieved
//   if (!user) {
//     const error = new HttpError(
//       "Could not find user with the provided id",
//       404
//     );
//     return next(error);
//   }

//   //instantiating new object using the blueprint from models
//   const createdShare = new Share({
//     user,
//     property,
//     share,
//   });

//   console.log(createdShare); // <----------------------- DELETE ME ! --------------------------

//   try {
//     //starting session
//     const sess = await mongoose.startSession();
//     //starting a transaction
//     sess.startTransaction();
//     //saves the share
//     await createdShare.save({ session: sess });
//     // //deduct bought shares from the availableShares field
//     // property.availableShares -= share; //TODO: move to the transaction
//     // //adding the user id to the property owners array
//     // //property.owners.push(user);
//     // property.propertyShares.push(createdShare);
//     // //saves the property
//     // await property.save({ session: sess });
//     //adding the share to the user shares array
//     user.userShares.push(createdShare);
//     //saves the user
//     await user.save({ session: sess });
//     //session commits the transaction if all previous commands has been executed successfully
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       "Property share purchase failed, please try again.",
//       500
//     );
//     return next(error);
//   }

//   //response to the request. Covert [property] to JavaScript object. {getters: true} removes the underscore from the id
//   res.status(200).json({ share: createdShare });
// };

// //sell property share
// const sellPropertyShare = async (req, res, next) => {
//   //get id from the url
//   const shareId = req.params.sid;

//   //instantiating new variable with a scope of the method
//   let share;

//   //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
//   try {
//     share = await Share.findById(shareId).populate("user property");
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not sell your share.",
//       500
//     );
//     return next(error);
//   }

//   console.log(share); // <----------------------- DELETE ME ! --------------------------

//   //check if property exist
//   if (!share) {
//     const error = new HttpError(
//       "Could not find share for the provided id",
//       404
//     );
//     return next(error);
//   }

//   // //instantiating new variable with a scope of the method
//   // let property;

//   // //try to get property by id from database with an asynchronous method. Catch and displays error if it fail
//   // try {
//   //   property = await Property.findById(propertyId);
//   // } catch (err) {
//   //   const error = new HttpError(
//   //     "Something went wrong, could not delete property.",
//   //     500
//   //   );
//   //   return next(error);
//   // }

//   // //check if property has been retrieved
//   // if (!property) {
//   //   const error = new HttpError(
//   //     "Could not find property for the provided id",
//   //     404
//   //   );
//   //   return next(error);
//   // }

//   //try to delete property from database with an asynchronous method. Catch and displays error if it fail
//   try {
//     //starting new session
//     const sess = await mongoose.startSession();
//     //starting a transaction
//     sess.startTransaction();
//     //adding back shares to the property available shares
//     share.property.availableShares += share.share;
//     //remove property from the user array
//     //share.property.owners.pull(share.user);
//     share.property.owners.pull(share.user);
//     //saves the update
//     await share.property.save({ session: sess });
//     //remove property from the user array
//     share.user.shares.pull(share);
//     //saves the update
//     await share.user.save({ session: sess });
//     //remove property
//     await share.remove({ session: sess });
//     //commit the transaction
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not delete property.",
//       500
//     );
//   }

//   //response to the request
//   res.status(200).json({ message: "Share sold." });
// };

//----------------------------------------------------------------FOW----------------------------------------------------------------

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

  // 
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

  //response to the request
  res.status(200).json({ message: "Property deleted." });
};

//exporting functions pointers rather than executables
exports.getPropertyById = getPropertyById;
exports.getPropertiesByUserId = getPropertiesByUserId;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;