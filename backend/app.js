/*
 * [app.js] file in a sense is the backbone of the server. All the requests are
 * redirected from here to the right file
 */

//import libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//local imports
const propertiesRoutes = require("./routes/properties-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

//instantiating [app] object(server)
const app = express();

//---------------------Middleware----------------------------

//add to use.
//bodyParser should be before anything else as the route its shorter. It will extract any given json data and convert to JS data structure.
//Once data is collected, [next()] is automatically called, next method triggered and receives the newly collected data
app.use(bodyParser.json());

app.use("/api/properties", propertiesRoutes);
app.use("/api/users", usersRoutes);

//Handling all unspecified routes. It is called if there was no respond from the previous methods
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//handling route errors. Below function will be called if there is an error with the request
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//---------------------Middleware----------------------------

//---------------------Database------------------------------
//[connect()] connect to the database as an asynchronous. [then()] if successful listen to the port or returns an error
mongoose
  .connect(
    "mongodb+srv://Savchev:namkaq-cicpap-5vycZo@cluster0.3mjmp.mongodb.net/properties?retryWrites=true&w=majority"
  )
  .then(() => {
    //listen to certain port
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
