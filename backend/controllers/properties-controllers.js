/*
 * [properties-controllers.js] file contain all functions for the properties routes
 */

//import libraries
const uuid = require("uuid"); // -----> D E L E T E   M E   A T   S O M E   P O I N T ! <-----
const { validationResult } = require("express-validator");

//local imports
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Property = require("../models/property");

//dummy data to use while don't have database   -----> D E L E T E   M E   A T   S O M E   P O I N T ! <-----
let DUMMY_PROPERTIES = [
  {
    id: "p1",
    title: "1604 The Heart",
    description:
      "The development towers 24 floors and offers stunning views across Salford Quays.Designed to be shaped like a heart, some apartments have unique curved shapes and some offer balconies with some great water views. The Heart also has an onsite concierge and is only a 5 minute walk from MediaCity UK Metrolink stop providing 15-minute links to the city centre. Shops and restaurants are only 250m away, whilst Old Trafford, the home of Manchester United FC is only a 20 minute walk away. Book a viewing.",
    //imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building,jpg/640px-NYC_Empire_State_Building.jpg',
    imageUrl:
      "https://c7.alamy.com/comp/CCCC9M/media-city-footbridge-and-studios-at-mediacityuk-at-night-salford-CCCC9M.jpg",
    location: {
      lat: 53.4721254,
      lng: -2.3026691,
    },
    address: "Blue Media City, Salford, United Kingdom M50 2TH",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description:
      'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan in New York City, United States. It was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York.',
    //imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building,jpg/640px-NYC_Empire_State_Building.jpg',
    imageUrl:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260/",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u2",
  },
];

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
  let properties;

  //get the properties by comparing user id from url against database creator field. Returns error if fail
  try {
    properties = await Property.find({ creator: userId }); //TODO: add an owner field to the database and create similar method
  } catch (err) {
    const error = new HttpError(
      "Fetching properties failed, please try again later.",
      500
    );
    return next(error);
  }

  //returns error in case no properties was found
  if (!properties || properties.length === 0) {
    return next(
      new HttpError("Could not find properties for the provided user id.", 404)
    );
  }

  //response to the request. Using [map] as we browse trough an array. Then covert to JavaScript object and activate the getters to get rid of the underscore
  res.json({
    properties: properties.map((property) =>
      property.toObject({ getters: true })
    ),
  });
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
  const { title, description, address, creator } = req.body;

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
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260/",
    creator,
  });

  //try to add new property to the database with the async method [save()]. Catch and display error if fail
  try {
    await createdProperty.save();
  } catch (err) {
    const error = new HttpError(
      "Creating new property failed, please try again.",
      500
    );
    return next(error);
  }
  //adding the new property to the database with the async method [save()]
  await createdProperty.save();

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

  //updating details
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
    property = await Property.findById(propertyId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete property.",
      500
    );
    return next(error);
  }

  //try to delete property from database with an asynchronous method. Catch and displays error if it fail
  try {
    await property.remove();
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
