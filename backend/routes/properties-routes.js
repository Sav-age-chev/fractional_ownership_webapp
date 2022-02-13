/*
 * [properties-routes.js] file contain all the code to handle url triggered events regarding properties
 */

//import libraries
const express = require("express");

//local imports
const propertiesControllers = require("../controllers/properties-controllers");

//instantiating [router] object
const router = express.Router();

//Dummy data to use while don't have database //TODO: Double check if you should have dummy data here

//get property by property id. Uses pointer to a function and not executing it ()
router.get("/:pid", propertiesControllers.getPropertyById);

//get property by user id. Uses pointer to a function and not executing it ()
router.get("/user/:uid", propertiesControllers.getPropertiesByUserId);

//add a new property. Uses pointer to a function and not executing it ()
router.post("/", propertiesControllers.createProperty);

//edit existing property. Uses pointer to a function and not executing it ()
router.patch("/:pid", propertiesControllers.updateProperty);

//delete existing property. Uses pointer to a function and not executing it ()
router.delete("/:pid", propertiesControllers.deleteProperty);

//exporting the file
module.exports = router;
