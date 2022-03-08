/*
 * [app.js] file in a sense is the backbone of the server. All the requests are
 * redirected from here to the right file
 */

//import libraries
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//local imports
const propertiesRoutes = require("./routes/properties-routes");
const usersRoutes = require("./routes/users-routes");
const sharesRoutes = require("./routes/shares-routes");
const HttpError = require("./models/http-error");

//instantiating [app] object(server)
const app = express();

//---------------------Middleware----------------------------

//add to use.
//bodyParser should be before anything else as the route its shorter. It will extract any given json data and convert to JS data structure.
//Once data is collected, [next()] is automatically called, next method triggered and receives the newly collected data
app.use(bodyParser.json());

//handle image requests. [express.static] just returns requested file without executing it
app.use("/uploads/images", express.static(path.join("uploads", "images")));

//adding headers to each request
app.use((req, res, next) => {
  //allows any domain to send request and prevent CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  //type headers that are allowed access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //which HTTP methods are allowed to use on the front end/attached to the coming request
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  //let the request continue
  next();
});

//routes
app.use("/api/properties", propertiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/shares", sharesRoutes);

//Handling all unspecified routes. It is called if there was no respond from the previous methods
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//handling route errors. Below function will be called if there is an error with the request
app.use((error, req, res, next) => {
  //if there is an error system rollback and delete uploaded images
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err); // <---- diagnostic ------ DELETE ME ! -------
    });
  }

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
    //"mongodb+srv://Savchev:namkaq-cicpap-5vycZo@cluster0.3mjmp.mongodb.net/properties?retryWrites=true&w=majority"
    "mongodb+srv://Savchev:namkaq-cicpap-5vycZo@cluster0.3mjmp.mongodb.net/fow?retryWrites=true&w=majority" //using new database(properties =>)
  )
  .then(() => {
    //listen to certain port
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
//---------------------Database------------------------------
