/*
 * [ImageUpload] components
 */

//import libraries
import React, { useRef, useState, useEffect } from "react";

//local imports
import Button from "./Button";

//style sheet
import "./ImageUpload.css";

//instantiating function
const ImageUpload = (props) => {
  //instantiating state
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState();

  //stores a value that establishes connection with the DOM element
  const filePickerRef = useRef();

  //[useEffect] executes and open preview whenever the file changes
  useEffect(() => {
    if (!file) {
      return;
    }
    //[FileReader] reads files as the name suggest :)
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  //function to preview and forward the file to rest of the component functions
  const pickedHandler = (event) => {
    //instantiating local variable
    let pickedFile;
    let fileIsValid = isValid;

    //check if there is a picked file and is just one
    if (event.target.files && event.target.files.length === 1) {
      //extract the file
      pickedFile = event.target.files[0];
      //set states
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    //always call function [onInput] and receive [pickedFile]
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  //function that connect to the DOM and pick up the image when onClick event is triggered
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  //returning JSX code
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

//export component
export default ImageUpload;
