/*
 * [properties-routes.js] file contain all the code to handle url triggered events regarding properties
 */

//import libraries
const express = require("express");
const { check } = require("express-validator");

//local imports
const propertiesControllers = require("../controllers/properties-controllers");

//instantiating [router] object
const router = express.Router();

//Dummy data to use while don't have database //TODO: Double check if you should have dummy data here

//get property by property id. Uses pointer to a function and not executing it ()
router.get("/:pid", propertiesControllers.getPropertyById);

//get property by user id. Uses pointer to a function and not executing it ()
router.get("/user/:uid", propertiesControllers.getPropertiesByUserId);

//add a new property. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  propertiesControllers.createProperty
);

//--------------------------------FOW----------------------------------------
//buy share of a property. Uses pointer to a function and not executing it ()
router.post("/share/:pid/:uid", [
  check("share").not().isEmpty(),
  check("share").isNumeric()
], propertiesControllers.buyPropertyShare);

//delete share of a property. Uses pointer to a function and not executing it ()
//router.delete("/share/sell/:pid/:uid", propertiesControllers.sellPropertyShare);
//--------------------------------FOW----------------------------------------

//edit existing property. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  propertiesControllers.updateProperty
);

//delete existing property. Uses pointer to a function and not executing it ()
router.delete("/:pid", propertiesControllers.deleteProperty);

//exporting the file
module.exports = router;
