/*
 * [users-routes.js] file contain all the code to handle url triggered events regarding users
 */

//import libraries
const express = require("express");
const { check } = require("express-validator");

//local imports
const usersControllers = require("../controllers/users-controllers");

//instantiating [router] object
const router = express.Router();

//Dummy data to use while don't have database //TODO: Double check if you should have dummy data here

//get user by the id. Uses pointer to a function and not executing it ()
router.get("/", usersControllers.getUsers);

//signup new user. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

//login existing user. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.post("/login", usersControllers.login);

//exporting the file
module.exports = router;
