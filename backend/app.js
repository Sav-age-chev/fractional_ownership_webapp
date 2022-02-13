/*
 * [app.js] file in a sense is the backbone of the server. All the requests are
 * redirected from here to the right file
 */

//import libraries
const express = require('express');
const bodyParser = require('body-parser');

//local imports
const propertiesRoutes = require('./routes/properties-routes');

//instantiating [app] object(server)
const app = express();

//---------------------Middleware----------------------------

//add to use
app.use('/api/properties', propertiesRoutes);

//handling route errors. Below function will be called if there is an error with the request
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

//---------------------Middleware----------------------------

//listen to certain port
app.listen(5000);