import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PropertyItem from "./PropertyItem";

import "./PropertyList.css";

/*
 * [PropertyList] components used to display list of users
 */

const PropertyList = (props) => {
  if (props.items.length === 0) {
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
        <PropertyItem
          key={property.id}
          id={property.id}
          image={property.imageUrl}
          title={property.title}
          description={property.description}
          address={property.address}
          creatorId={property.creator}
          coordinates={property.location}
        />
      ))}
    </ul>
  );
};

export default PropertyList;
