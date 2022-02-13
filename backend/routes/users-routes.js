/*
 * [users-routes.js] file contain all the code to handle url triggered events regarding users
 */

//import libraries
const express = require("express");

//local imports
const usersControllers = require("../controllers/users-controllers");

//instantiating [router] object
const router = express.Router();

//Dummy data to use while don't have database //TODO: Double check if you should have dummy data here

//get user by the id. Uses pointer to a function and not executing it ()
router.get("/", usersControllers);

//signup new user. Uses pointer to a function and not executing it ()
router.post("/signup", usersControllers);

//login existing user. Uses pointer to a function and not executing it ()
router.post("/login", usersControllers);

//exporting the file
module.exports = router;
