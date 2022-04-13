/*
 * [LoadingSpinner.js] render loading spinner component
 */

//import libraries
import React from "react";

//styling sheet
import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

//export component
export default LoadingSpinner;
