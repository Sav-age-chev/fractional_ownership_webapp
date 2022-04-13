/*
 * [check-auth] use third party library [jsonwebtoken] to validate incoming request from the front-end
 */

//libraries
const jwt = require("jsonwebtoken");

//local imports
const HttpError = require("../models/http-error");

//function
module.exports = (req, res, next) => {
  //browser automatically sends OPTIONS request before the actual request
  if (req.method === "OPTIONS") {
    return next();
  }
  //the token is part of the header rather than the body
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'

    //throwing an error if fail to retrieve the token
    if (!token) {
      throw new Error("Authentication failed!");
    }

    //verifying the request using th private key and its counterpart token. Returns error if fails
    const decodedToken = jwt.verify(token, "private_key_user");

    console.log("Passing authentication: " + decodedToken.userId.toString()); // <-------- diagnostic -------- DELETE ME ! ----------------------------------------------------------

    //dynamically adding the user id to the request from the decoded token
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

