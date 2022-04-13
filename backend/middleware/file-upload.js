/*
 * [file-upload] use third party library [multer] to process images
 */

//import libraries
const multer = require("multer");
const uuid = require("uuid");

//mapping types of files
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//function
const fileUpload = multer({
  //set size limit for the file in KB
  limits: 500000,
  //setting how to store the file
  storage: multer.diskStorage({
    //Instantiating destination
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    //Generating id as name and add the correct extension
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + "." + ext);
    },
  }),
  //Filtering the files
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

//export function
module.exports = fileUpload;
