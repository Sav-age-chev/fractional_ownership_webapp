/*
 * [users-controllers.js] file contain all functions for the users routes
 */

//import libraries
const uuid = require("uuid");
const { validationResult } = require("express-validator");

//local imports
const HttpError = require("../models/http-error");

//dummy data to use while don't have database
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Plamen Savchev",
    email: "test@test.com",
    password: "tester",
  },
];

//get users
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

//signup user
const signup = (req, res, next) => {
  //check validation results and return error in case is not empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  //get data from the body
  const { name, email, password } = req.body;

  //check if user already exists
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists!", 422);
  }

  //create new user
  const createdUser = {
    id: uuid.v4(),
    name, //When same name: (name == name: name)
    email,
    password,
  };

  //add the new user to the array list
  DUMMY_USERS.push(createdUser);

  //response to the request
  res.status(201).json({ user: createdUser });
};

//login user
const login = (req, res, next) => {
  //get data from the body
  const { email, password } = req.body;

  //get user if one exist with the given email
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  //otherwise throw error
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Credential not recognized. Please check entries or register!",
      401
    );
  }

  //response to the request
  res.json({ message: "Logged in!" });
};

//exporting functions pointers rather than executables
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
