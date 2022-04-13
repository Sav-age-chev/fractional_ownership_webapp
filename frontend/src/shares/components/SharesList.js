/*
 * [SharesList] components used to display list of shares
 */

//import libraries
import React from "react";

//local imports
import ShareItem from "./ShareItem";
import Card from "../../shared/components/UIElements/Card";

//stylesheet
import "./SharesList.css";

//function
const SharesList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No shares found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="shares-list">
      {props.items.map((share) => (
        <ShareItem
          key={share.id}
          id={share.id}
          image={share.image}
          propertyTitle={share.propertyTitle}
          cost={share.cost}
          shares={share.share}
        />
      ))}
    </ul>
  );
};

//export function
export default SharesList;