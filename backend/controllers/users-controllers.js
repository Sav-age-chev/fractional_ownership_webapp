/*
 * [users-controllers.js] file contain all functions for the users routes
 */

//import libraries
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  //instantiating new variable with scope of the function
  let hashedPassword;

  //passing the user password to hashed. The larger is the [salt] number - the harder it will be to crack
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
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
    password: hashedPassword,
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

  //instantiating new variable
  let token;

  //assigning encrypted data to the token using jwt cryptographic algorithm. [sign] function parameters: [token value],[private key to encrypt the value],[expiration time]
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  console.log(token);
  //response to the request
  //res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  //returns error if the user is not found
  if (!existingUser) {
    const error = new HttpError("Invalid credential, please try again.", 403);
    return next(error);
  }

  //instantiating local variable
  let isValidPassword;

  //validating the password entered by the user against he database using bcryptjs
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Unable to login. Please check your credential and try again."
    );
    return next(error);
  }

  //returns error if the credential are invalid
  if (!isValidPassword) {
    const error = new HttpError("Invalid credential, please try again.", 403);
    return next(error);
  }

  //instantiating new variable
  let token;

  //assigning encrypted data to the token using jwt cryptographic algorithm. [sign] function parameters: [token value],[private key to encrypt the value],[expiration time]
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  console.log(token);

  //response to the request
  // res.json({
  //   message: "Logged in!",
  //   user: existingUser.toObject({ getters: true }),
  // });
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

//exporting functions pointers rather than executables
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
