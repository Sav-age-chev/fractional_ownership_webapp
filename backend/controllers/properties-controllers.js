/*
 * [properties-controllers.js] file contain all functions for the properties routes
 */

//import libraries
const uuid = require("uuid");
const { validationResult } = require("express-validator");

//local imports
const HttpError = require("../models/http-error");

//dummy data to use while don't have database
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

//get property by id
const getPropertyById = (req, res, next) => {
  //get the property by comparing id from url against database
  const propertyId = req.params.pid;
  const property = DUMMY_PROPERTIES.find((p) => {
    return p.id === propertyId;
  });
  //returns error in case no property was found
  if (!property) {
    throw new HttpError("Could not find a property for the provided id.", 404);
  }

  //response to the request. In this case {property} == {property: property}
  res.json({ property });
};

//Get property by user id
const getPropertiesByUserId = (req, res, next) => {
  //get the properties by comparing id from url against database
  const userId = req.params.uid;
  const properties = DUMMY_PROPERTIES.filter((p) => {
    return p.creator === userId;
  });
  //returns error in case no properties was found
  if (!properties || properties.length === 0) {
    return next(
      new HttpError("Could not find properties for the provided user id.", 404)
    );
  }

  //response to the request. In this case {properties} == {properties: properties}
  res.json({ properties });
};

//create new property
const createProperty = (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  //object destructuring
  const { title, description, coordinates, address, creator } = req.body;
  const createdProperty = {
    id: uuid.v4(),
    title, //When same name: (title == title: title)
    description,
    location: coordinates,
    address,
    creator,
  };

  //adding the new property to the database
  DUMMY_PROPERTIES.push(createdProperty);

  //response to the request. In this case {property} == {property: property}
  res.status(201).json({ property: createdProperty });
};

//update existing property
const updateProperty = (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  //get data from the body
  const { title, description } = req.body;
  //get id from the url
  const propertyId = req.params.pid;

  //creates a copy of the property
  const updatedProperty = {
    ...DUMMY_PROPERTIES.find((p) => p.id === propertyId),
  };
  //get the index from the array for the selected property
  const propertyIndex = DUMMY_PROPERTIES.findIndex((p) => p.id === propertyId);
  //updating details
  updatedProperty.title = title;
  updatedProperty.description = description;
  //replacing the old with the new property
  DUMMY_PROPERTIES[propertyIndex] = updatedProperty;
  //response to the request
  res.status(200).json({ property: updatedProperty });
};

//delete existing property
const deleteProperty = (req, res, next) => {
  //get id from the url
  const propertyId = req.params.pid;
  //check if the property exist in the database
  if (!DUMMY_PROPERTIES.find((p) => p.id === propertyId)) {
    throw new HttpError("Could not find the property", 404);
  }
  //creating new array that replacing the old one once the loop completes. It keeps all entries but the match
  DUMMY_PROPERTIES = DUMMY_PROPERTIES.filter((p) => p.id !== propertyId);
  //response to the request
  res.status(200).json({ message: "Property deleted." });
};

//exporting functions pointers rather than executables
exports.getPropertyById = getPropertyById;
exports.getPropertiesByUserId = getPropertiesByUserId;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
