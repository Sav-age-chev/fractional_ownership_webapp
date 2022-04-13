/*
 * [shares-routes.js] file contain all the code to handle url triggered events regarding shares
 */

//import libraries
const express = require("express");
const { check } = require("express-validator");

//local imports
const sharesControllers = require("../controllers/shares-controllers");
const checkAuth = require("../middleware/check-auth");

//instantiating [router] object
const router = express.Router();

// //get share by id. Uses pointer to a function and not executing it ()
router.get("/:sid", sharesControllers.getShareById);

//get shares by user id. Uses pointer to a function and not executing it ()
router.get("/user/:uid", sharesControllers.getSharesByUserId);

//get shares by property id. Uses pointer to a function and not executing it ()
router.get("/property/:pid", sharesControllers.getSharesByPropertyId);

//adding a validating middleware. Only request with tokens would be authorised below this point
router.use(checkAuth);

//buy share of a property. Uses pointer to a function and not executing it ()
router.post(
  "/buy/:pid",
  [check("share").not().isEmpty(), check("share").isNumeric()],
  sharesControllers.buyPropertyShare
);

//delete share of a property. Uses pointer to a function and not executing it ()
//router.delete("/sell/:sid", sharesControllers.sellPropertyShare);

//delete share of a property. Uses pointer to a function and not executing it ()
router.patch("/sell/:sid", sharesControllers.updateSharesOwner);

//edit existing share. First execute methods to validate the input and then uses pointer to a function and not executing it ()
router.patch(
  "/edit/:sid",
  [check("sellPrice").not().isEmpty(), check("sellPrice").isNumeric()],
  //[check("share").not().isEmpty()],
  sharesControllers.updateShare
);

//exporting the file
module.exports = router;
