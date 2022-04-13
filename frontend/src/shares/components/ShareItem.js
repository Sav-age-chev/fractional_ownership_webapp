/*
 * [SharesItem.js] component is used to display the information of a share
 */

//import libraries
import React from "react";
import { Link } from "react-router-dom"; //Raps and renders anchor tag and block navigation logic

//local imports
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

//stylesheet
import "./ShareItem.css";

//function
const ShareItem = (props) => {
  return (
    <li className="share-item">
      <Card className="share-item__content">
        <Link to={`/shares/${props.id}`}>
          <div className="share-item__image">
            <Avatar
              image="http://localhost:5000/uploads/images/share.png"
              alt={props.propertyTitle}
            />
          </div>
          <div className="share-item__info">
            <h2>{props.propertyTitle}</h2>
            <h3>Cost: {props.cost}</h3>
            <h3>
              {" "}
              Own: {props.shares} {props.shares === 1 ? "Percent" : "Percents"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

//export function
export default ShareItem;
