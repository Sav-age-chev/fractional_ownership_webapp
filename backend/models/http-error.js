/*
 * [HttpError] class provide blueprint for handling http related error
 */

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //Add a "message" property
    this.code = errorCode; //Add a "code" property
  }
}

//exporting the file
module.exports = HttpError;