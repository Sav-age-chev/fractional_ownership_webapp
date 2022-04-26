/*
 * [location.js] file contain all functions
 */
//import libraries
const axios = require("axios");

//local imports
const HttpError = require("../models/http-error");

//Google Cloud API key
const API_KEY = process.env.GOOGLE_API_KEY;

//function takes an address reaches to Google API and converts it to coordinates. [async] is allowing function to work with a promise(waiting)
async function getCoordsForAddress(address) {
  //Using `(backtick) to create a template literal for a string where can inject dynamic segments.
  //[encodeURIComponents] get rid of white spaces and special symbols
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  //extracting only the required data from the response
  const data = response.data;

  //check if data is set or there is status field
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  //returns coordinates on given address (e.g., "location" : { "lat" : 37.4267861, "lng" : -122.0806032 }) and stores them
  const coordinates = data.results[0].geometry.location;

  //returns coordinates to call
  return coordinates;
}

//exporting the function
module.exports = getCoordsForAddress;
