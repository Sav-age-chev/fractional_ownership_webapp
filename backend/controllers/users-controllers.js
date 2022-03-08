/*
 * [users-controllers.js] file contain all functions for the users routes
 */

//import libraries
const { validationResult } = require("express-validator");

//local imports
const HttpError = require("../models/http-error");
const User = require("../models/user");

//get users
const getUsers = async (req, res, next) => {
  //instantiating new variable with scope of the object
  let users;
  //fetching all users excluding their [password] field. Return error if method fails
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later",
      404
    );
    return next(error);
  }
  //as the return is an array need to use map to convert to JavaScript objects
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//signup user
const signup = async (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //get data from the body
  const { name, email, password } = req.body;

  //instantiating new variable with a scope of the method
  let existingUser;

  //trying to find user by an email with an asynchronous method. Catch and displays error if it fails
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  //returns error message if user with the given email exist
  if (existingUser) {
    const error = new HttpError("User already exists, please login.", 422);
    return next(error);
  }

  //instantiating new object using the blueprint from models
  const createdUser = new User({
    name, //When same name: (name == name: name)
    email,
    image: req.file.path,
    password,
    properties: [],
    userShares: [],
  });

  //add the new user to the database with async function. Returns error if fail
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  //response to the request
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

//login user
const login = async (req, res, next) => {
  //get data from the body
  const { email, password } = req.body;

  //instantiating new variable with a scope of the method
  let existingUser;

  //trying to find user by an email with an asynchronous method. Catch and displays error if it fails
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  //returns error if the credential are invalid
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credential, please try again.", 401);
    return next(error);
  }

  //response to the request
  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

//exporting functions pointers rather than executables
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
