/*
 * [Avatar] component is used for the users profile image
 */

//import libraries
import React from 'react';

//stylesheet
import './Avatar.css';

//function
const Avatar = props => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

//export function
export default Avatar;
