import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import UserPropertyItem from "./UserPropertyItem";

import "./PropertyList.css";

/*
 * [UserPropertyList] components used to display list of user properties
 */

const UserPropertyList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="property-list center">
        <Card>
          <h2>No properties found. Post advert?</h2>
          <Button to="/properties/new">POST ADVERT</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="property-list">
      {props.items.map((property) => (
        <UserPropertyItem
          key={property.id}
          id={property.id}
          image={property.image}
          title={property.title}
          description={property.description}
          address={property.address}
          price={property.price}
          creatorId={property.creator}
          availableShares={property.availableShares}
          approved={property.approved}
          coordinates={property.location}
          onDelete={props.onDeleteProperty}
        />
      ))}
    </ul>
  );
};

//export method
export default UserPropertyList;