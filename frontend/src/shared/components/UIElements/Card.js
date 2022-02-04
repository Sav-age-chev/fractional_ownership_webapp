import React from 'react';

import './Card.css';

/*
 * [Card] component is used to display user and property card in list
 */

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
