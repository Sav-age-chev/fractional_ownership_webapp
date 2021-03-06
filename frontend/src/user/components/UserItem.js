/*
 * [UserItem.js] component is used to display the information of a user within
 */

//import libraries
import React from "react";
import { Link } from "react-router-dom"; //Raps and renders anchor tag and block navigation logic

//local imports
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

//stylesheet
import "./UserItem.css";

//function
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/properties`}>
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.propertyCount}{" "}
              {props.propertyCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

//export function
export default UserItem;