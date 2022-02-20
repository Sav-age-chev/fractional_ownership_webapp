/*
 * [shares-routes.js] file contain all the code to handle url triggered events regarding shares
 */

//import libraries
const express = require("express");
const { check } = require("express-validator");

//local imports
const sharesControllers = require("../controllers/shares-controllers");

//instantiating [router] object
const router = express.Router();

//TODO: ------------- MAKE THIS FUNCTION ----------------
// //get share by id. Uses pointer to a function and not executing it ()
// router.get("/:sid", propertiesControllers.getShareById);

//TODO: ------------- MAKE THIS FUNCTION ----------------
// //get shares by user id. Uses pointer to a function and not executing it ()
// router.get("/user/:uid", propertiesControllers.getSharesByUserId);

// //add a new property. First execute methods to validate the input and then uses pointer to a function and not executing it ()
// router.post(
//   "/",
//   [
//     check("title").not().isEmpty(),
//     check("description").isLength({ min: 5 }),
//     check("address").not().isEmpty(),
//   ],
//   propertiesControllers.createProperty
// );

//buy share of a property. Uses pointer to a function and not executing it ()
router.post("/buy/:pid", [
  check("share").not().isEmpty(),
  check("share").isNumeric()
], sharesControllers.buyPropertyShare);

//delete share of a property. Uses pointer to a function and not executing it ()
router.delete("/sell/:sid", sharesControllers.sellPropertyShare);

// //edit existing property. First execute methods to validate the input and then uses pointer to a function and not executing it ()
// router.patch(
//   "/:pid",
//   [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
//   propertiesControllers.updateProperty
//);

// //delete existing property. Uses pointer to a function and not executing it ()
// router.delete("/:pid", propertiesControllers.deleteProperty);

//exporting the file
module.exports = router;