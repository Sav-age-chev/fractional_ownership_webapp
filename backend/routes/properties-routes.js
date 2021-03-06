/*
 * [properties-routes.js] file contain all the code to handle url triggered events regarding properties
 */

//import libraries
const express = require("express");
const { check } = require("express-validator");

//local imports
const fileUpload = require("../middleware/file-upload");
const propertiesControllers = require("../controllers/properties-controllers");
const checkAuth = require("../middleware/check-auth");

//instantiating [router] object
const router = express.Router();

//get all properties. Call to pointer to a function
router.get("/list", propertiesControllers.getAllProperties);

//get property by property id. Uses pointer to a function and not executing it ()
router.get("/:pid", propertiesControllers.getPropertyById);

//get property by share id. Uses pointer to a function and not executing it ()
router.get("/share/:sid", propertiesControllers.getPropertyByShareId);

//get property by user id. Uses pointer to a function and not executing it ()
router.get("/user/:uid", propertiesControllers.getPropertiesByUserId);

//adding a validating middleware. Only request with tokens would be authorised below this point
router.use(checkAuth);

//add a new property. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  propertiesControllers.createProperty
);

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
